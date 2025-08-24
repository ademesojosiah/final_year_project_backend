# WebSocket Implementation for Order Management

## Overview

This NestJS backend implements real-time WebSocket communication for order management using Socket.io. The system provides instant updates when orders are created, updated, or deleted.

## Features Implemented

### 1. Real-time Order Updates
- **Event**: `{orderId}/update` - Specific order update events
- **Event**: `orderUpdated` - General order update events
- **Event**: `orderCreated` - New order creation events
- **Event**: `orderDeleted` - Order deletion events

### 2. Order Update Event Format

```typescript
interface OrderUpdateEvent {
  orderId: string;                    // The order ID being updated
  status: OrderStatus;                // New status of the order
  estimatedDate?: string;             // Optional: Updated estimated completion date
  timestamp: string;                  // ISO timestamp of when update occurred
  message?: string;                   // Optional: Custom message to display to user
}

type OrderStatus = 'In Production' | 'In Printing' | 'In Binding' | 'Packaging' | 'Delivery';
```

### 3. Order Sorting
- Orders are automatically sorted by newest first based on `dateIssued`
- New orders are added to the beginning of the list
- `getAllOrders()` returns orders in descending chronological order

## WebSocket Events

### Client Events (Frontend → Backend)
- `joinRoom` - Join the orders room to receive updates
- `leaveRoom` - Leave the orders room

### Server Events (Backend → Frontend)
- `{orderId}/update` - Specific order update with OrderUpdateEvent data
- `orderUpdated` - General order update notification
- `orderCreated` - New order creation notification
- `orderDeleted` - Order deletion notification

## Frontend Integration

See `WEBSOCKET_EVENTS.md` for detailed frontend implementation examples and usage patterns.

## Technical Implementation

### Gateway: `src/orders/orders.gateway.ts`
- Handles WebSocket connections and room management
- Emits order-specific and general update events
- Provides real-time communication layer

### Service: `src/orders/orders.service.ts`
- Manages order business logic
- Sorts orders by newest first
- Maintains in-memory order storage (ready for MongoDB migration)

### Controller: `src/orders/orders.controller.ts`
- REST API endpoints for order management
- Triggers WebSocket events after CRUD operations
- Integrates with authentication system

## Usage

1. Frontend connects to WebSocket server at `ws://localhost:3000`
2. Server automatically emits events to all connected clients (no room management needed)
3. Client can listen to specific order updates using `{orderId}/update`
4. Server automatically emits events when orders are modified via REST API

This implementation provides a complete real-time order management system with both REST API and WebSocket functionality.