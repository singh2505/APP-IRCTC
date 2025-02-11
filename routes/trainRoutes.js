const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const trainController = require("../controllers/trainController");


router.post("/create", verifyToken,trainController.createTrain);
router.get("/availability", trainController.getTrainAvailability);

module.exports = router;
