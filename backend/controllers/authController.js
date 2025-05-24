const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

exports.register = async (req, res) => {
  const { name, email, password, type } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    const user = new User({
      ...req.body,
      password: hashed,
      otp,
      otpExpiry
    });

    await user.save();
    await sendEmail(email, 'Verify Your Account', `Your OTP is ${otp}`);
    res.json({ msg: 'OTP sent to your email. Please verify.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error registering user.', error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ msg: 'Invalid or expired OTP.' });
  }
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
  res.json({ msg: 'OTP verified successfully.' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendEmail(user.email, 'Login OTP', `Your login OTP is ${otp}`);
    res.json({ msg: 'OTP sent for login. Please verify.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error during login.' });
  }
};

exports.verifyLoginOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ msg: 'Invalid or expired OTP.' });
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = jwt.sign({ userId: user._id, role: user.type }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ msg: 'Login successful.', token });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'No user with that email.' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();
  await sendEmail(email, 'Reset Password OTP', `Your OTP is ${otp}`);
  res.json({ msg: 'OTP sent to email for password reset.' });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ msg: 'Invalid or expired OTP.' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
  res.json({ msg: 'Password reset successful.' });
};
