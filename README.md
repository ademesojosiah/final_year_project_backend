# Orderly Backend API

A NestJS backend server for managing printing orders with real-time updates via WebSocket.

## Features

- **Authentication**: JWT-based authentication with signup/login
- **Order Management**: CRUD operations for printing orders
- **Real-time Updates**: WebSocket integration for live order status updates
- **Mock Data**: Pre-populated with sample printing orders
- **Validation**: Input validation using class-validator
- **TypeScript**: Fully typed with TypeScript

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Orders (Protected routes - require JWT token)
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/search?customer=name` - Search orders by customer name
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

## WebSocket Events

Connect to `ws://localhost:3000` and listen for:
- `orderCreated` - New order created
- `orderUpdated` - Order status updated
- `orderDeleted` - Order deleted

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   copy .env.example .env
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

## Usage Examples

### Authentication
```javascript
// Signup
POST /api/auth/signup
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}

// Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Creating an Order
```javascript
POST /api/orders
Authorization: Bearer <your-jwt-token>
{
  "productName": "Business Cards",
  "quantity": 500,
  "sheetType": "Fliers"
}
```

### WebSocket Client Example
```javascript
const socket = io('ws://localhost:3000');

socket.emit('joinRoom', 'orders');

socket.on('orderCreated', (data) => {
  console.log('New order:', data.order);
});

socket.on('orderUpdated', (data) => {
  console.log('Order updated:', data.order);
});
```

## Order Status Types
- "In Production"
- "In Printing" 
- "In Binding"
- "Packaging"
- "Delivery"

## Sheet Types
- "Fliers"
- "OMR Sheets"
- "Jotters"

## Technologies Used
- NestJS
- TypeScript
- JWT Authentication
- Socket.io for WebSocket
- class-validator for validation
- bcryptjs for password hashing
- MongoDB ready (currently using mock data)

## Development

The server starts on `http://localhost:3000` with WebSocket support.

All routes except authentication are protected and require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```
