// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// exports.verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: "Token not provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     console.log("Decoded Token:", decoded); // DEBUG: Check token contents
    
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.error("JWT Verification Error:", err.message); // DEBUG
//     return res.status(403).json({ error: "Invalid token" });
//   }
// };
console.log("🚀 verifyToken middleware is loaded!");
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  console.log("Headers:", req.headers); // Log headers
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Error: No token found or incorrect format.");
    return res.status(401).json({ error: "Unauthorized: Token missing or invalid format" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token);

  try {
    console.log("JWT_SECRET from ENV:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Log decoded token

    if (!decoded.role) {
      console.log("Error: Token does not contain role.");
      return res.status(403).json({ error: "Unauthorized: Invalid token payload" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(403).json({ error: "Unauthorized: Invalid Token" });
  }
};
