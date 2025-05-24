const nodemailer = require('nodemailer');

// Set up Nodemailer transporter using your email service (Gmail in this case)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Email ID from .env
    pass: process.env.EMAIL_PASS,  // App password from .env
  },
});

// Function to send OTP to the email provided
const sendOtp = async (toEmail, otp) => {
  const mailOptions = {
    from: `"StyleWave" <${process.env.EMAIL_USER}>`,  // Sender email
    to: toEmail,  // Receiver's email (user-provided)
    subject: 'Your OTP Code - StyleWave',  // Subject of the email
    html: `
      <div style="font-family:sans-serif;">
        <h2>Hello from StyleWave 👋</h2>
        <p>Your OTP is:</p>
        <h1 style="color: #4f46e5;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <br/>
        <p>Cheers,<br/>Team StyleWave</p>
      </div>
    `,
  };

  try {
    // Send OTP email
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${toEmail}`);
  } catch (err) {
    console.error('❌ Error sending OTP:', err);
    throw err;
  }
};

module.exports = sendOtp;
