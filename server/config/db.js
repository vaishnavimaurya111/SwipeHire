const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI;
  if (!connUri) {
    console.warn('⚠️ MONGODB_URI not provided. Server will run in in-memory / mock database fallback mode.');
    return false;
  }
  try {
    try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
    const conn = await mongoose.connect(connUri, { dbName: 'swipehire' });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.db.databaseName})`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Fallback to mock API data mode active.');
    return false;
  }
};


module.exports = connectDB;
