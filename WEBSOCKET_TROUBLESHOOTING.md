# WebSocket Connection Troubleshooting

## Issue: WebSocket connection to 'ws://localhost:3000/' failed

### ✅ Server Status: RESOLVED
The NestJS server is now running successfully on `http://localhost:3000` with WebSocket support.

### Frontend Connection Tips:

#### 1. **Install Socket.io Client for React**
```bash
npm install socket.io-client
# or
yarn add socket.io-client
```

#### 2. **React Hook Implementation**
```javascript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = (orderId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [orderUpdate, setOrderUpdate] = useState(null);

  useEffect(() => {
    // Create socket connection
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Connected to WebSocket server:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from WebSocket server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setIsConnected(false);
    });

    // Listen for order updates
    if (orderId) {
      newSocket.on(`${orderId}/update`, (updateEvent) => {
        console.log('📦 Order update received:', updateEvent);
        setOrderUpdate(updateEvent);
      });
    }

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [orderId]);

  return { socket, isConnected, orderUpdate };
};

export default useSocket;
```

#### 3. **Using the Hook in Your Component**
```javascript
import React, { useEffect } from 'react';
import useSocket from './hooks/useSocket'; // Adjust path as needed

const OrderContent = ({ orderId }) => {
  const { socket, isConnected, orderUpdate } = useSocket(orderId);

  useEffect(() => {
    if (orderUpdate) {
      // Handle the order update in your UI
      console.log('Order status updated:', orderUpdate.status);
      // Update your component state here
    }
  }, [orderUpdate]);

  return (
    <div>
      <div>
        Connection Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      {orderUpdate && (
        <div>
          <p>Latest Update: {orderUpdate.message}</p>
          <p>Status: {orderUpdate.status}</p>
          <p>Time: {new Date(orderUpdate.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default OrderContent;
```

#### 4. **Alternative: Direct Implementation in Component**
```javascript
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const OrderContent = ({ orderId = 'ORD-25470' }) => {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [orderUpdate, setOrderUpdate] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const socketConnection = io('http://localhost:3000');
    setSocket(socketConnection);

    // Connection event handlers
    socketConnection.on('connect', () => {
      console.log('✅ Connected to server');
      setConnectionStatus('Connected');
    });

    socketConnection.on('disconnect', () => {
      console.log('🔌 Disconnected from server');
      setConnectionStatus('Disconnected');
    });

    socketConnection.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setConnectionStatus('Error');
    });

    // Listen for specific order updates
    socketConnection.on(`${orderId}/update`, (updateEvent) => {
      console.log('📦 Order update for', orderId, ':', updateEvent);
      setOrderUpdate(updateEvent);
    });

    // Listen for general order events
    socketConnection.on('orderCreated', (data) => {
      console.log('🆕 New order created:', data);
    });

    socketConnection.on('orderUpdated', (data) => {
      console.log('🔄 Order updated:', data);
    });

    socketConnection.on('orderDeleted', (data) => {
      console.log('🗑️ Order deleted:', data);
    });

    // Cleanup function
    return () => {
      socketConnection.close();
    };
  }, [orderId]);

  return (
    <div>
      <h3>WebSocket Status: {connectionStatus}</h3>
      <p>Listening for updates on order: {orderId}</p>
      
      {orderUpdate && (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h4>Latest Order Update:</h4>
          <p><strong>Order ID:</strong> {orderUpdate.orderId}</p>
          <p><strong>Status:</strong> {orderUpdate.status}</p>
          <p><strong>Message:</strong> {orderUpdate.message}</p>
          <p><strong>Timestamp:</strong> {new Date(orderUpdate.timestamp).toLocaleString()}</p>
          {orderUpdate.estimatedDate && (
            <p><strong>Estimated Date:</strong> {orderUpdate.estimatedDate}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderContent;
```

### Common Issues & Solutions:

1. **Wrong URL Protocol**: Use `http://` not `ws://` with Socket.io
2. **Server Not Running**: Ensure NestJS server is active (✅ Fixed)
3. **Port Conflicts**: Server was using port 3000 (✅ Fixed)
4. **CORS Issues**: Server has CORS enabled for all origins (✅ Configured)

### Test Connection:
Open browser console and test:
```javascript
const socket = io('http://localhost:3000');
socket.on('connect', () => console.log('Connected!'));
```

The server is now ready to accept WebSocket connections! 🚀
