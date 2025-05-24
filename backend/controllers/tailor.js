// controllers/tailor.js
const User = require('../models/User'); // Import the User model (common for all roles)
const Tailor = require('../models/Tailor'); // Import the Tailor model (custom schema)

exports.getTailorProfile = async (req, res) => {
  try {
    const tailor = await Tailor.findOne({ user: req.user._id }); // Assume user is authenticated
    if (!tailor) return res.status(404).json({ message: "Tailor profile not found" });
    res.status(200).json(tailor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTailorProfile = async (req, res) => {
  try {
    const tailor = await Tailor.findOneAndUpdate(
      { user: req.user._id }, // Find the tailor by user ID
      req.body, // Update with the data from the request body
      { new: true }
    );
    if (!tailor) return res.status(404).json({ message: "Tailor not found" });
    res.status(200).json(tailor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
