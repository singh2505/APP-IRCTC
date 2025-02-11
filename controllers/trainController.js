

const Train = require("../models/train");

exports.createTrain = async (req, res, next) => {
  try {
    const { name, source, destination, totalSeats } = req.body;
    const adminKey = req.headers.adminkey; // Use the correct header key

    console.log("Headers:", req.headers);
    console.log("Received Admin Key:", adminKey); 

    // Ensures user is authenticated (JWT token required)
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }

    // Ensures user is an admin (role-based access control)
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    // Validate admin key
    if (!adminKey || adminKey !== String(process.env.ADMIN_KEY).trim()) {
      return res.status(403).json({ error: "Unauthorized: Invalid Admin Key" });
    }

    // Check if train already exists
    const existingTrains = await Train.findBySourceAndDestination(
      source,
      destination
    );
    if (existingTrains.length > 0) {
      return res.status(400).json({ error: "Train already exists" });
    }

    // Create new train
    const newTrain = new Train({ name, source, destination, totalSeats });
    const trainId = await Train.create(newTrain);

    res.status(201).json({ trainId });
  } catch (err) {
    next(err);
  }
};

exports.getTrainAvailability = async (req, res, next) => {
  try {
    const { source, destination } = req.query;
    const trains = await Train.findBySourceAndDestination(source, destination);
    res.status(200).json(trains);
  } catch (err) {
    next(err);
  }
};
