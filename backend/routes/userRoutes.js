const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validateUser');

router.get('/profile', validateUser, (req, res) => {
  // Since the user is authenticated, we can now access req.user
  res.json({ message: 'Welcome to your profile!', user: req.user });
});

module.exports = router;
