/**
 * Socket.io Real-Time Event Handlers
 */
function initSocketServer(io) {
  io.on('connection', (socket) => {
    console.log(`⚡ Socket client connected: ${socket.id}`);

    // Join room for specific chat/match
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`👤 Socket ${socket.id} joined room: ${room}`);
    });

    // Handle sending real-time message
    socket.on('send_message', (data) => {
      const { room, message } = data;
      console.log(`💬 Message sent to room ${room}:`, message.text || '[Attachment]');
      // Broadcast to all clients in room including sender
      io.to(room).emit('receive_message', message);
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      socket.to(data.room).emit('user_typing', data);
    });

    // Handle Match Alert Broadcast
    socket.on('trigger_match_notification', (data) => {
      console.log(`🎉 Live Match Alert: ${data.studentName} matched with ${data.company}`);
      io.emit('new_match_alert', data);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket client disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSocketServer;
