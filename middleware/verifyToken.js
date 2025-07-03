// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // ✅ log the token
    req.user = decoded;                     // ✅ assign the decoded token to req.user
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token", error: err.message });
  }
};

module.exports = verifyToken;
