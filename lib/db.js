const mongoose = require('mongoose');

let isConnected = false;

module.exports = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
  } catch (err) {
    console.error('DB connection error:', err);
    throw err;
  }
};
