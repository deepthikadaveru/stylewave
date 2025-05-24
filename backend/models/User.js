// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  brand: String, // for tailors/designers/resellers
  type: { type: String, enum: ['User', 'Tailor', 'Designer', 'Reseller'], default: 'User' },

  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },

  // Additional fields for Tailor-like roles
  description: String,
  profilePicture: String,
  images: [String],
  address: String,
  city: String,
  lat: String,
  lng: String,
  instagram: String,
  facebook: String,
  website: String,

  // OTP fields
  otp: String,
  otpExpiresAt: Date,
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
