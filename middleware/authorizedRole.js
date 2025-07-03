// middleware/authorizedRole.js
module.exports = function (allowedRoles) {
  return function (req, res, next) {
    const userRole = req.user.role;
    console.log("Checking user role:", userRole); // optional debug

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }

    next();
  };
};
