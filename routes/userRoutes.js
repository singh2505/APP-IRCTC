const express = require("express");
const router = express.Router();
const { getUser } = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Route to get user details, only accessible with a valid token
router.get("/me", verifyToken, getUser);

module.exports = router;
