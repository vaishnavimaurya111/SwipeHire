import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Connect to Socket.io server
    const newSocket = io(window.location.origin || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('⚡ Socket connected:', newSocket.id);
    });

    newSocket.on('new_match_alert', (data) => {
      setNotification({
        id: Date.now(),
        type: 'match',
        title: "🎉 It's a Match!",
        message: `${data.studentName} & ${data.company} just matched!`,
      });
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const clearNotification = () => setNotification(null);

  return (
    <SocketContext.Provider value={{ socket, notification, setNotification, clearNotification }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
