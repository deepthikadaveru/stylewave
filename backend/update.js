const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// Salt rounds for hashing
const saltRounds = 10;

// Hash the password and update the user
const hashPasswordForExistingUsers = async () => {
  try {
    // Connect to your database (ensure the URL is correct)
    await mongoose.connect('mongodb+srv://deepthi:Paused.0@cluster0.wxhlczr.mongodb.net/stylewave?retryWrites=true&w=majority&appName=Cluster0');

    // First, hash passwords for all creators
    const creators = await tdrdata.find();
    for (let creator of creators) {
      if (creator.password && !creator.password.startsWith('$2b$')) {
        const hashedPassword = await bcrypt.hash(creator.password, saltRounds);
        creator.password = hashedPassword;
        await creator.save();
        console.log(`Updated password for creator: ${creator.email}`);
      }
    }

   

    console.log('Password hashing completed for all users.');
  } catch (err) {
    console.error('Error during password migration:', err);
  } finally {
    mongoose.disconnect();
  }
};

// Run the script
hashPasswordForExistingUsers();
