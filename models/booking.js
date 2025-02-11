// database connection import
const db = require("../config/database");

// Booking Model
class Booking {
  constructor({ trainId, userId, seatCount }) {
    this.trainId = trainId;
    this.userId = userId;
    this.seatCount = seatCount;
  }

  static async create(newBooking) {
    const query = "INSERT INTO bookings (train_id, user_id, seat_count) VALUES (?, ?, ?)";
    const values = [newBooking.trainId, newBooking.userId, newBooking.seatCount];

    try {
      const [result] = await db.query(query, values);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByUserIdAndTrainId(userId, trainId) {
    const query = "SELECT * FROM bookings WHERE user_id = ? AND train_id = ?";

    try {
      const [rows] = await db.query(query, [userId, trainId]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Booking;