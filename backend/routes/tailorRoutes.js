// routes/tailorRoutes.js
const express = require('express');
const router = express.Router();
const { getTailorProfile, updateTailorProfile } = require('../controllers/tailor');
const authMiddleware = require('../middleware/auth'); // Assume authentication middleware is in place

// Routes specific to tailors
router.get('/profile', authMiddleware, getTailorProfile); // Fetch tailor profile
router.put('/profile', authMiddleware, updateTailorProfile); // Update tailor profile

module.exports = router;
