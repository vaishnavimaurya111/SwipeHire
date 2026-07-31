const mongoose = require('mongoose');

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI;
  if (!connUri) {
    console.warn('⚠️ MONGODB_URI not provided. Server will run in in-memory / mock database fallback mode.');
    return false;
  }
  try {
    const conn = await mongoose.connect(connUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Fallback to mock API data mode active.');
    return false;
  }
};

module.exports = connectDB;
