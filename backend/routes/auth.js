// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findOne({ _id: decoded.id });
    
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    req.user = user;
    
    // Allow access only if the user's role matches the required role for the route
    if (req.originalUrl.includes(user.role)) {
      next(); // proceed if the role matches
    } else {
      res.status(403).json({ message: 'Access denied for this role' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
