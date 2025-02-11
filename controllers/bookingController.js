const db = require("../config/database");
const Train = require("../models/train");
const Booking = require("../models/booking");

// Handles race conditions while booking seats
exports.bookSeat = async (req, res, next) => {
  let connection;
  try {
    const { trainId, seatCount } = req.body;
    const userId = req.user.userId;

    connection = await db.getConnection();
    console.log("Connected to database.");

    // Set a timeout for transactions
    await connection.query("SET innodb_lock_wait_timeout = 10;");
    
    for (let attempt = 0; attempt < 2; attempt++) {
      await connection.beginTransaction();
      console.log("Transaction initiated.");

      try {
        // Lock the row for concurrent update handling
        const [train] = await connection.query(
          "SELECT available_seats FROM trains WHERE id = ? FOR UPDATE",
          [trainId]
        );

        if (!train.length || train[0].available_seats < seatCount) {
          throw { status: 400, message: "Insufficient seats available" };
        }

        // Deduct seats if available
        const [updateResult] = await connection.query(
          "UPDATE trains SET available_seats = available_seats - ? WHERE id = ? AND available_seats >= ?",
          [seatCount, trainId, seatCount]
        );

        if (updateResult.affectedRows === 0) {
          throw { status: 400, message: "Seats unavailable due to concurrent booking" };
        }

        // Register booking
        await connection.query(
          "INSERT INTO bookings (train_id, user_id, seat_count) VALUES (?, ?, ?)",
          [trainId, userId, seatCount]
        );

        await connection.commit();
        console.log("Transaction successful.");
        return res.status(201).json({ message: "Seat booking confirmed" });
      } catch (err) {
        await connection.rollback();
        console.error("Transaction aborted due to error:", err);

        if (err.code === "ER_LOCK_WAIT_TIMEOUT" || err.code === "ER_LOCK_DEADLOCK") {
          console.warn("Retrying booking process...");
          continue;
        }
        return res.status(err.status || 500).json({ error: err.message });
      }
    }
    return res.status(500).json({ error: "Booking attempt failed after multiple retries" });
  } catch (err) {
    console.error("Unexpected error occurred:", err);
    next(err);
  } finally {
    if (connection) {
      console.log("Closing database connection.");
      connection.release();
    }
  }
};

// Retrieves user-specific booking details
exports.getBookingDetails = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { trainId } = req.query;

    console.log("Fetching booking details for user...");
    console.log(`User ID: ${userId}, Train ID: ${trainId}`);

    // Retrieve booking info for the user and train
    const booking = await Booking.findByUserIdAndTrainId(userId, trainId);
    if (!booking) {
      console.error("No booking found for given details.");
      return res.status(404).json({ error: "No booking record exists" });
    }

    console.log("Booking details retrieved successfully:", booking);
    res.status(200).json(booking);
  } catch (err) {
    console.error("Error while retrieving booking details:", err);
    next(err);
  }
};
