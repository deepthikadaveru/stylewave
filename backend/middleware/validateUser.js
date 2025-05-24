const jwt = require('jsonwebtoken');
const  User  = require('../models/User'); // Assuming you have a User model

const validateUser = async (req, res, next) => {
  // Get token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from "Bearer token"

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to the request object
    req.user = decoded;

    // Optionally: Retrieve full user details from the DB if needed (e.g., User model)
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = validateUser;
