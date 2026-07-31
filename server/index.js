require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const initSocketServer = require('./services/socket');

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Attach Socket.io instance to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Database Connection
connectDB();

// API Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'SwipeHire API',
    timestamp: new Date().toISOString(),
    aiEngine: process.env.GEMINI_API_KEY ? 'Google Gemini 2.5 Flash API' : 'Active Fallback Simulator',
  });
});

// Initialize Real-Time Socket Server
initSocketServer(io);

// Production Static Serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
  🚀 SwipeHire Server running on port ${PORT}
  🔗 API Endpoint: http://localhost:${PORT}/api
  ⚡ Socket.io Real-time engine active
  `);
});
