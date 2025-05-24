require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const http = require('http');
const  socketIo  = require('socket.io');
const onlineUsers = new Map(); // userId => Set of socket IDs

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ------------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',  // your React app origin
  methods: ['GET','POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
// Serve static images
app.use('/images', express.static(path.join(__dirname, 'public/images')));
// somewhere near the top of server.js
app.use('/images/tailors', express.static(path.join(__dirname, 'public/images/tailors')));
app.use('/images/designers', express.static(path.join(__dirname, 'public/images/designers')));
app.use('/images/resellers', express.static(path.join(__dirname, 'public/images/resellers')));
app.use('/images/users', express.static(path.join(__dirname, 'public/images/users')));
app.use('/images/portfolios', express.static(path.join(__dirname, 'public/images/portfolios')));

// --- MongoDB Connection ----------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Schemas & Models ------------------
const reviewSchema = new mongoose.Schema({
  user: String, // or ObjectId if using user accounts
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const creatorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  brand: String,
  type: String, // Tailor, Designer, Reseller
  description: String,
  profilePicture: String,
  images: [String],
  address: String,
  city: String,
  lat: Number,
  lng: Number,
  instagram: String,
  facebook: String,
  website: String,
  workingHours: String,             // e.g. "10:00 AM - 8:00 PM"
  averageFare: Number,              // e.g. 1668
  services: [String],               // e.g. ["Bridal wear", "Saree draping"]
  ratings: [reviewSchema],          // user-submitted ratings
  reviews: [reviewSchema],
  lastSeen: { type: Date, default: null }
});
const Creator = mongoose.model('tdrdata', creatorSchema, 'tdrdata');
console.log('Using collection:', Creator.collection.name);

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: {
    filename: String,
    path: String,
    size: Number
  },
  lastSeen: { type: Date, default: null }

});
const Customer = mongoose.model('profiles', customerSchema);

const otpSchema = new mongoose.Schema({ email: String, otp: String, expiresAt: Date, role: String });
const Otp = mongoose.model('otps', otpSchema);

const resetSchema = new mongoose.Schema({ email: String, token: String, expiresAt: Date });
const Reset = mongoose.model('resets', resetSchema);

// --- Email Setup -----------------------
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, text }) => {
  try {
    await transporter.sendMail({ from: `"StyleWave" <${process.env.EMAIL_USER}>`, to, subject, text });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

// POST route to handle form submission
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, // now using your real email from .env
    subject: "New Contact Us Message",
    text: `You have a new message from: 
  Name: ${name}
  Email: ${email}
  
  Message:
  ${message}`
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
    res.status(200).json({ message: "Message sent successfully!" });
  });
});

// --- Multer Setup (General for Creators) ----
// Allowed image types
const allowedTypes = /jpeg|jpg|png|webp/;
const fileFilter = (req, file, cb) => {
  const extOK  = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeOK = allowedTypes.test(file.mimetype);
  if (extOK && mimeOK) cb(null, true);
  else cb(new Error('Only image files (jpeg/jpg/png/webp) are allowed'));
};

// ------ General Creator Upload (e.g., profile pics) ------
const tailorStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // store under public/images/creators or tailor/designer/reseller based on route
    const role = req.originalUrl.split('/')[3]; // e.g. 'tailors' or 'designers'
    const folder = path.join(__dirname, `public/images/tailors`);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`;
    cb(null, unique);
  }
});
const upload = multer({ storage: tailorStorage, fileFilter });


// ------ Creator Portfolio Upload ------
const portfolioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join(__dirname, `public/images/tailors`);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`;
    cb(null, unique);
  }
});
const portfolioUpload = multer({ storage: portfolioStorage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });



// ------ User Avatar Upload ------
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'public/images/users')),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`;
    cb(null, unique);
  }
});
const userUpload = multer({ storage: userStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Centralized multer error handler
const uploadErrorHandler = (err, req, res, next) => {
  if (err) {
    console.error('Multer error:', err);
    return res.status(400).json({ error: err.message });
  }
  next();
};


// --- Routes -----------------------------
// Customer signup (alias: '/register/user')
app.post(
  '/register/user',
  userUpload.single('profilePicture'),
  uploadErrorHandler,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      const exists = await Customer.findOne({ email });
      if (exists) return res.status(409).json({ error: 'Email already exists' });

      const hash = await bcrypt.hash(password, 10);
      const profilePicture = req.file
        ? { filename: req.file.filename, path: req.file.path, size: req.file.size }
        : null;

      await Customer.create({ name, email, password: hash, profilePicture });
      return res.status(201).json({ message: 'Customer registered' });
    } catch (err) {
      console.error('Registration error:', err);
      return res.status(500).json({ error: 'Registration failed' });
    }
  }
);



// Creator signup per role dynamic endpoint
// Replace the creator registration route block in your index.js with the updated one below:

['tailor','designer','reseller'].forEach(role => {
  app.post(
    `/api/register/${role}`,
    upload.fields([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'images',         maxCount: 10 }
    ]),
    async (req, res) => {
      try {
        // 1) dump raw body to confirm Multer saw everything
        console.log('→ RAW req.body:', req.body);
        console.log('→ RAW req.files:', Object.keys(req.files));

        // 2) Required fields check
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
          return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // 3) Duplicate‐email guard
        if (await Creator.findOne({ email })) {
          return res.status(409).json({ error: 'Email already exists' });
        }

        // 4) File handling
        const profilePictureFile = req.files['profilePicture']?.[0];
        const imageFiles         = req.files['images'] || [];

        // 5) Build an explicit data object
        const doc = {
          name,
          email,
          password:      await bcrypt.hash(password, 10),
          phone:         req.body.phone,
          brand:         req.body.brand,
          type:          role.charAt(0).toUpperCase() + role.slice(1),
          description:   req.body.description,
          profilePicture: profilePictureFile?.filename || '',
          images:         imageFiles.map(f => f.filename),
          address:        req.body.address,
          city:           req.body.city,
          lat:            parseFloat(req.body.lat),
          lng:            parseFloat(req.body.lng),
          instagram:      req.body.instagram,
          facebook:       req.body.facebook,
          website:        req.body.website,
          
          // ← your three new fields
          workingHours:  req.body.workingHours,
          averageFare:   Number(req.body.averageFare),
          services:      Array.isArray(req.body.services)
                            ? req.body.services
                            : (req.body.services || '')
                                .split(',')
                                .map(s => s.trim())
                                .filter(Boolean),

          // if you want to initialize ratings/reviews
          ratings:       [],
          reviews:       []
        };

        console.log('🔥 BODY:', req.body);
        console.log('🔥 SERVICES:', req.body.services);


        // 6) Persist
        await Creator.create(doc);
        res.status(201).json({ message: `${doc.type} registered` });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
      }
    }
  );
});


// --------- Login + OTP Routes ---------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const isTestEmail = email.endsWith('@example.com');
    let user = await Creator.findOne({ email });
    let role = 'creator';

    if (!user) {
      user = await Customer.findOne({ email });
      role = 'customer';
    }

    if (!user) return res.status(404).json({ error: 'User not found' });

    console.log("Received password:", password);
    console.log("Stored password hash:", user.password);

    if (isTestEmail) {
      // Try plain-text first
      let match = password === user.password;
    
      // If plain-text failed, try bcrypt
      if (!match) {
        match = await bcrypt.compare(password, user.password);
      }
    
      // If *both* fail, reject
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      // Regular users only get bcrypt
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    // Role logic for creators
    if (user.type === 'Tailor') role = 'tailor';
    else if (user.type === 'Designer') role = 'designer';
    else if (user.type === 'Reseller') role = 'reseller';

    // OTP logic
    const otp = isTestEmail ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await Otp.findOneAndUpdate({ email }, { email, otp, expiresAt, role }, { upsert: true });

    if (isTestEmail) {
      console.log('Test account detected, skipping email sending.');
      return res.json({ message: 'Test email detected, OTP set to 123456 (mocked).' });
    }

    await sendEmail({
      to: email,
      subject: 'Your StyleWave OTP',
      text: `Your OTP is ${otp}`
    });

    res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  
  try {
    const rec = await Otp.findOne({ email, otp });
    if (!rec) return res.status(400).json({ error: 'Invalid OTP' });

    if (new Date() > rec.expiresAt) {
      await Otp.deleteOne({ _id: rec._id });
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Handle all creator subroles correctly
    const Model = ['creator', 'tailor', 'designer', 'reseller'].includes(rec.role) ? Creator : Customer;
    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found during OTP verification' });
    const token = jwt.sign(
      { id: user._id, role: rec.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    await Otp.deleteOne({ _id: rec._id });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: rec.role,
        type: user.type,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});


// --------- Password Reset Routes ---------
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    // check in both collections
    let user = await Creator.findOne({ email }) || await Customer.findOne({ email });
    if (!user) {
      // respond with 200 to avoid email enumeration
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }
    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await Reset.findOneAndUpdate({ email }, { email, token, expiresAt }, { upsert: true });
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendEmail({ to: email, subject: 'Reset Your Password', text: `Click to reset: ${link}` });
    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to initiate reset' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const rec = await Reset.findOne({ token });
    if (!rec || new Date() > rec.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    // update password in correct collection
    let user = await Creator.findOne({ email: rec.email });
    if (user) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    } else {
      user = await Customer.findOne({ email: rec.email });
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }
    await Reset.deleteOne({ _id: rec._id });
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Reset failed' });
  }
});


// --------- Profile Lookup ---------
app.get('/api/tailors', async (req, res) => {
  try {
    const tailors = await Creator.find({ type: 'Tailor' });
    res.json(tailors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tailor data' });
  }
});

// Get one tailor by ID
app.get('/api/tailors/:id', async (req, res) => {
  try {
    const tailor = await Creator.findById(req.params.id);
    if (!tailor) return res.status(404).json({ error: 'Tailor not found' });
    res.json(tailor);
  } catch (err) {
    console.error('Error fetching tailor by ID:', err);
    res.status(500).json({ error: 'Server error fetching tailor data' });
  }
});





app.put('/api/tailors/:id', async (req, res) => {
  console.log('PUT /api/tailors/:id payload:', req.params.id, req.body);

  // Disallow changing these fields
  const updates = { ...req.body };
  delete updates.email;
  delete updates.ratings;
  delete updates.reviews;

  try {
    const updated = await Creator.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,          // return the updated doc
        runValidators: true // enforce schema types/required on update
      }
    );
    if (!updated) {
      console.log('Tailor not found for ID', req.params.id);
      return res.status(404).json({ error: 'Tailor not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error in PUT /api/tailors/:id:', err);
    // If it's a validation error, send that message back
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to update tailor' });
  }
});

app.post(
  '/api/tailors/:id/portfolio',
  portfolioUpload.array('images', 10),
  uploadErrorHandler,
  async (req, res) => {
    try {
      // Build URLs pointing at /images/tailors/filename
      const urls = req.files.map(f => `/images/tailors/${f.filename}`);
      const updated = await Creator.findByIdAndUpdate(
        req.params.id,
        { $push: { images: { $each: urls } } },
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Tailor not found' });
      res.json(updated);
    } catch (err) {
      console.error('Error uploading portfolio images:', err);
      res.status(500).json({ error: err.message || 'Portfolio upload failed' });
    }
  }
);




// Submit a rating
app.post('/api/tailors/:id/ratings', async (req, res) => {
  const { user, rating, comment } = req.body;
  if (!rating || !comment) return res.status(400).json({ error: 'Rating & comment required' });
  try {
    const t = await Creator.findById(req.params.id);
    if (!t) return res.status(404).json({ error: 'Tailor not found' });
    t.ratings.push({ user, rating, comment });
    await t.save();
    res.status(201).json({ message: 'Rating added', rating: t.ratings.slice(-1)[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding rating' });
  }
});

// Submit a review (optional)
app.post('/api/tailors/:id/reviews', async (req, res) => {
  const { user, rating, comment } = req.body;
  if (!rating || !comment) return res.status(400).json({ error: 'Rating & comment required' });
  try {
    const t = await Creator.findById(req.params.id);
    if (!t) return res.status(404).json({ error: 'Tailor not found' });
    t.reviews.push({ user, rating, comment });
    await t.save();
    res.status(201).json({ message: 'Review added', review: t.reviews.slice(-1)[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding review' });
  }
});


app.get('/api/designers', async (req, res) => {
  try {
    const designers = await Creator.find({ type: 'Designer' });
    res.json(designers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch designer data' });
  }
});

// Get one designer by ID
app.get('/api/designers/:id', async (req, res) => {
  try {
    const designer = await Creator.findById(req.params.id);
    if (!designer) return res.status(404).json({ error: 'Designer not found' });
    res.json(designer);
  } catch (err) {
    console.error('Error fetching designer by ID:', err);
    res.status(500).json({ error: 'Server error fetching designer data' });
  }
});




// Submit a rating for a designer
app.post('/api/designers/:id/ratings', async (req, res) => {
  const { user, rating, comment } = req.body;
  if (!rating || !comment) return res.status(400).json({ error: 'Rating & comment required' });
  try {
    const d = await Creator.findById(req.params.id);
    if (!d) return res.status(404).json({ error: 'Designer not found' });
    d.ratings.push({ user, rating, comment });
    await d.save();
    res.status(201).json({ message: 'Rating added', rating: d.ratings.slice(-1)[0] });
  } catch (err) {
    console.error('Error adding designer rating:', err);
    res.status(500).json({ error: 'Error adding rating' });
  }
});

// Submit a review for a designer
app.post('/api/designers/:id/reviews', async (req, res) => {
  const { user, rating, comment } = req.body;
  if (!rating || !comment) return res.status(400).json({ error: 'Rating & comment required' });
  try {
    const d = await Creator.findById(req.params.id);
    if (!d) return res.status(404).json({ error: 'Designer not found' });
    d.reviews.push({ user, rating, comment });
    await d.save();
    res.status(201).json({ message: 'Review added', review: d.reviews.slice(-1)[0] });
  } catch (err) {
    console.error('Error adding designer review:', err);
    res.status(500).json({ error: 'Error adding review' });
  }
});

app.put('/api/designers/:id', async (req, res) => {
  console.log('PUT /api/designers/:id payload:', req.params.id, req.body);

  // Disallow changing these fields
  const updates = { ...req.body };
  delete updates.email;
  delete updates.ratings;
  delete updates.reviews;

  try {
    const updated = await Creator.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,          // return the updated document
        runValidators: true // enforce schema on update
      }
    );

    if (!updated) {
      console.log('Designer not found for ID', req.params.id);
      return res.status(404).json({ error: 'Designer not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Error in PUT /api/designers/:id:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to update designer' });
  }
});


app.post(
  '/api/designers/:id/portfolio',
  portfolioUpload.array('images', 10),
  uploadErrorHandler,
  async (req, res) => {
    try {
      const urls = req.files.map(f => `/images/designers/${f.filename}`);
      const updated = await Creator.findByIdAndUpdate(
        req.params.id,
        { $push: { images: { $each: urls } } },
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Designer not found' });
      res.json(updated);
    } catch (err) {
      console.error('Error uploading designer portfolio images:', err);
      res.status(500).json({ error: err.message || 'Portfolio upload failed' });
    }
  }
);



app.get('/api/resellers', async (req, res) => {
  try {
    const resellers = await Creator.find({ type: 'Reseller' });
    res.json(resellers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reseller data' });
  }
});

app.get('/api/resellers/:id', async (req, res) => {
  try {
    const reseller = await Creator.findById(req.params.id);
    if (!reseller) return res.status(404).json({ error: 'Reseller not found' });
    res.json(reseller);
  } catch (err) {
    console.error('Error fetching reseller by ID:', err);
    res.status(500).json({ error: 'Server error fetching reseller data' });
  }
});



// Submit a rating for a reseller
app.post('/api/resellers/:id/ratings', async (req, res) => {
  const { user, rating, comment } = req.body;
  if (!rating || !comment) return res.status(400).json({ error: 'Rating & comment required' });
  try {
    const r = await Creator.findById(req.params.id);
    if (!r) return res.status(404).json({ error: 'Reseller not found' });
    r.ratings.push({ user, rating, comment });
    await r.save();
    res.status(201).json({ message: 'Rating added', rating: r.ratings.slice(-1)[0] });
  } catch (err) {
    console.error('Error adding reseller rating:', err);
    res.status(500).json({ error: 'Error adding rating' });
  }
});

// Submit a review for a reseller
app.post('/api/resellers/:id/reviews', async (req, res) => {
  const { user, rating, comment } = req.body;
  if (!rating || !comment) return res.status(400).json({ error: 'Rating & comment required' });
  try {
    const r = await Creator.findById(req.params.id);
    if (!r) return res.status(404).json({ error: 'Reseller not found' });
    r.reviews.push({ user, rating, comment });
    await r.save();
    res.status(201).json({ message: 'Review added', review: r.reviews.slice(-1)[0] });
  } catch (err) {
    console.error('Error adding reseller review:', err);
    res.status(500).json({ error: 'Error adding review' });
  }
});

app.put('/api/resellers/:id', async (req, res) => {
  console.log('PUT /api/resellers/:id payload:', req.params.id, req.body);

  // Disallow changing these fields
  const updates = { ...req.body };
  delete updates.email;
  delete updates.ratings;
  delete updates.reviews;

  try {
    const updated = await Creator.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,          // return the updated document
        runValidators: true // enforce schema validation
      }
    );

    if (!updated) {
      console.log('Reseller not found for ID', req.params.id);
      return res.status(404).json({ error: 'Reseller not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Error in PUT /api/resellers/:id:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to update reseller' });
  }
});

app.post(
  '/api/resellers/:id/portfolio',
  portfolioUpload.array('images', 10),
  uploadErrorHandler,
  async (req, res) => {
    try {
      const urls = req.files.map(f => `/images/resellers/${f.filename}`);
      const updated = await Creator.findByIdAndUpdate(
        req.params.id,
        { $push: { images: { $each: urls } } },
        { new: true }
      );

      if (!updated) return res.status(404).json({ error: 'Reseller not found' });
      res.json(updated);
    } catch (err) {
      console.error('Error uploading reseller portfolio images:', err);
      res.status(500).json({ error: err.message || 'Portfolio upload failed' });
    }
  }
);


// Fetch profile data by email
app.get('/api/profile/:email', async (req, res) => {
  const { email } = req.params;
  try {
    let user = await Creator.findOne({ email });
    if (!user) {
      user = await Customer.findOne({ email });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const profileData = {
      name: user.name,
      email: user.email,
      description: user.description || '',
      profilePicture: user.profilePicture,
    };
    
    res.json(profileData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching profile data' });
  }
});


app.post(
  '/api/register/user/avatar',
  userUpload.single('profilePicture'),
  uploadErrorHandler,
  async (req, res) => {
    console.log('Avatar upload body:', req.body);
    console.log('Avatar upload file:', req.file);

    try {
      const { email } = req.body;
      if (!email) 
        return res.status(400).json({ error: 'Email is required' });

      const user = await Customer.findOne({ email });
      if (!user) 
        return res.status(404).json({ error: 'User not found' });

      if (!req.file) 
        return res.status(400).json({ error: 'No file uploaded' });

      // Save only the filename (and optional metadata) in Mongo
      user.profilePicture = {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      };
      await user.save();

      return res.json({
        message: 'Avatar updated successfully',
        profilePicture: user.profilePicture
      });
    } catch (err) {
      console.error('Avatar upload failed:', err);
      return res.status(500).json({ error: 'Avatar upload failed' });
    }
  }
);

// Multer already configured as `upload` (creatorStorage)
app.post(
  '/api/register/:role/:id/avatar',
  upload.single('profilePicture'),
  uploadErrorHandler,
  async (req, res) => {
    const { role, id } = req.params;
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const url = `/images/${role}s/${req.file.filename}`;
      console.log('Generated image URL:', url);

      const updated = await Creator.findByIdAndUpdate(
        id,
        { profilePicture: url },
        { new: true }
      );

      if (!updated) return res.status(404).json({ error: `${role} not found` });

      res.json(updated);
    } catch (err) {
      console.error(`Error uploading ${role} avatar:`, err);
      res.status(500).json({ error: err.message || 'Avatar upload failed' });
    }
  }
);



// Random 2 Tailors
app.get('/api/explore/tailors', async (req, res) => {
  console.log("Received request to fetch tailors"); // Debug log
  try {
    const tailors = await Creator.aggregate([
      { $match: { type: 'Tailor' } },
      { $sample: { size: 2 } }
    ]);
    res.json(tailors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch random tailors' });
  }
});



// Random 2 Designers
app.get('/api/explore/designers', async (req, res) => {
  console.log("Received request to fetch designers"); // Debug log
  try {
    const designers = await Creator.aggregate([
      { $match: { type: 'Designer' } },
      { $sample: { size: 2 } }
    ]);
    res.json(designers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch random designers' });
  }
});


// Random 2 Resellers
app.get('/api/explore/resellers', async (req, res) => {
  console.log("Received request to fetch resellers"); // Debug log
  try {
    const resellers = await Creator.aggregate([
      { $match: { type: 'Reseller' } },
      { $sample: { size: 2 } }
    ]);
    res.json(resellers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch random resellers' });
  }
});

app.get('/api/all-users', async (req, res) => {
  try {
    const creators = await Creator.find().select('_id name type profilePicture');
    const customers = await Customer.find().select('_id name email profilePicture');
    
    const addOnlineStatus = (userList) => userList.map(u => ({
      ...u,
      online: onlineUsers.has(u._id.toString())
    }));

    const formattedCreators = creators.map(u => ({
      _id: u._id,
      name: u.name,
      role: u.type.toLowerCase(), // tailor/designer/reseller
      profilePicture: u.profilePicture,
      lastSeen: u.lastSeen
    }));

    const formattedCustomers = customers.map(u => ({
      _id: u._id,
      name: u.name,
      role: 'customer',
      profilePicture: u.profilePicture?.filename 
        ? `/images/users/${u.profilePicture.filename}` 
        : '/images/default.jpg',
        lastSeen: u.lastSeen
    }));


    res.json([...formattedCreators, ...formattedCustomers]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


// ====== REST API Endpoint ======
app.get('/api/tdrdata', async (req, res) => {
  try {
    const users = await Creator.find().select('_id name type profilePicture');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/unseen-count/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const count = await Message.countDocuments({ to: userId, read: false });
    res.json({ unseenCount: count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unseen count' });
  }
});



const User = mongoose.model('User', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  role: String,
  profilePicture: String  
}));

const Message = mongoose.model('Message', new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderModel' },
  to: { type: mongoose.Schema.Types.ObjectId, refPath: 'toModel' },
  senderModel: { type: String, enum: ['tdrdata', 'profiles'] },
  toModel: { type: String, enum: ['tdrdata', 'profiles'] },
  text: String,
  roomId:String,
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
}));



// ====== HTTP + Socket.IO Server Setup ======
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust this to your frontend URL
    methods: ["GET", "POST"]
  }
});

// 1. Auth middleware
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload should contain at least: { userId: '...', name: '...', ... }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// 2. `/api/auth/me` route
app.get('/api/auth/me', requireAuth, async (req, res) => {
  // If you need fresh data from Mongo, you can fetch from your User model:
  // const userDoc = await User.findOne({ userId: req.user.userId });
  // return res.json(userDoc);

  // Or just return the JWT payload:
  res.json(req.user);
});


// Handle the root GET request for testing
app.get('/', (req, res) => {
  res.send('Server is running');
});

function getRoomId(a, b) {
  return [a, b].sort().join('_');
}

// just above io.on('connection', …)
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = payload.id;      // attach the user’s Mongo _id
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// ====== Socket.IO Logic ======
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  const userId = socket.userId;               // from our middleware
  console.log(`🔌 Authenticated user: ${userId}`);
  console.log(`🔌 User connected: ${userId}`);
  console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
  
  socket.join(socket.userId); // personal room
 
  socket.on('joinChat', async ({ to }) => {
     console.log('🧩 joinChat received from', userId, 'to', to);
     const room = getRoomId(socket.userId, to);
    socket.join(room);

 
  });

  socket.on('sendMessage', async (msg) => {
  console.log('📥 Incoming message:', msg);

  const roomId = getRoomId(socket.userId, msg.to);

  const newMsg = new Message({
    sender: socket.userId,
    to: msg.to,
    senderModel: msg.senderModel,
    toModel: msg.toModel,
    text: msg.text,
    roomId,
    timestamp: new Date()
  });

  await newMsg.save();
  console.log('✅ Message saved:', newMsg);

  const populatedMsg = await Message.findById(newMsg._id)
    .populate('sender', 'name profilePicture role')
    .populate('to', 'name profilePicture role');

  io.to(roomId).emit('receiveMessage', populatedMsg); // ✅ One consistent room
  console.log(`🔁 Emitting message to room: ${roomId}`);

  socket.on('messageRead', async ({ messageId }) => {
    try {
      const msg = await Message.findById(messageId);
      if (!msg) return;
  
      // Mark message as read only if current user is recipient
      if (msg.to.toString() === socket.userId.toString() && !msg.read) {
        msg.read = true;
        await msg.save();
  
        // Emit updated message to both sender and receiver rooms
        io.to(msg.roomId).emit('messageReadUpdate', { messageId, read: true });
      }
    } catch (err) {
      console.error('Error updating read status:', err);
    }
  });
  
  socket.on('typing', ({ room }) => {
    socket.to(room).emit('typing', { userId: socket.userId });
  });
  
  socket.on('stopTyping', ({ room }) => {
    socket.to(room).emit('stopTyping', { userId: socket.userId });
  });
  
  // Add socket id to user
if (!onlineUsers.has(socket.userId)) {
  onlineUsers.set(socket.userId, new Set());
}
onlineUsers.get(socket.userId).add(socket.id);

// Emit user online event globally (optional)
io.emit('userOnline', { userId: socket.userId });

// On disconnect
socket.on('disconnect', async () => {
  const userSockets = onlineUsers.get(socket.userId);
  if (userSockets) {
    userSockets.delete(socket.id);
    if (userSockets.size === 0) {
      onlineUsers.delete(socket.userId);
      io.emit('userOffline', { userId: socket.userId });

      try {
        await Creator.findByIdAndUpdate(socket.userId, { lastSeen: new Date() });
        await Customer.findByIdAndUpdate(socket.userId, { lastSeen: new Date() });
      } catch (err) {
        console.error('Error updating lastSeen:', err);
      }
    }
  }
  console.log(`❌ User disconnected: ${socket.userId}`);
});


});

socket.on('getChatHistory', async ({ with: otherUserId }) => {
  const myId = socket.userId;

  const history = await Message.find({
    $or: [
      { sender: myId, to: otherUserId },
      { sender: otherUserId, to: myId }
    ]
  })
    .sort({ timestamp: -1 })

    .populate('sender', 'name profilePicture role')
    .populate('to', 'name profilePicture role');

  socket.emit('chatHistory', history);
});

  

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${userId}`);
  });
});



// ====== Start Server (ONE LISTEN ONLY) ======
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
