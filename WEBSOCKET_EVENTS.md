# WebSocket Events Documentation

## Order Update Events

### Event: `{orderId}/update`

When an order is updated, the backend emits a specific WebSocket event with the format `{orderId}/update`.

#### Event Data Structure

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

#### Frontend Implementation Example

```javascript
// Connect to WebSocket
const socket = io('ws://localhost:3000');

// No need to join rooms - just listen for events directly!

// Listen for specific order updates
const orderId = 'ORD-12345';
socket.on(`${orderId}/update`, (updateEvent) => {
  console.log('Order update received:', updateEvent);
  
  // Update UI with new status
  updateOrderStatus(updateEvent.orderId, updateEvent.status);
  
  // Show notification
  showNotification(updateEvent.message);
  
  // Update estimated date if provided
  if (updateEvent.estimatedDate) {
    updateEstimatedDate(updateEvent.orderId, updateEvent.estimatedDate);
  }
});

// Listen for general order events
socket.on('orderUpdated', (data) => {
  console.log('General order update:', data);
});

socket.on('orderCreated', (data) => {
  console.log('New order created:', data);
  // Refresh order list or add new order to UI
  refreshOrderList();
});

socket.on('orderDeleted', (data) => {
  console.log('Order deleted:', data);
  // Remove order from UI
  removeOrderFromUI(data.orderId);
});
```

#### Example Event Data

```json
{
  "orderId": "ORD-12345",
  "status": "In Printing",
  "estimatedDate": "25/08/2025",
  "timestamp": "2025-08-24T14:30:00.000Z",
  "message": "Order ORD-12345 status updated to In Printing"
}
```

## Order List Sorting

Orders are automatically sorted by newest first (based on `dateIssued` field) when retrieved from the API.

### API Endpoints

- `GET /api/orders` - Returns all orders sorted by newest first
- `PUT /api/orders/:id` - Updates an order and emits WebSocket events
- `POST /api/orders` - Creates a new order and emits WebSocket events
- `DELETE /api/orders/:id` - Deletes an order and emits WebSocket events

### WebSocket Connection

```javascript
// Connect to WebSocket server
const socket = io('ws://localhost:3000');

// That's it! No need to join rooms - just listen for events

// Handle connection events
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});
```

## Real-time Order Tracking

You can now implement real-time order tracking by:

1. Listening to specific order update events using `{orderId}/update`
2. Updating the UI immediately when status changes
3. Showing live notifications to users
4. Automatically refreshing estimated delivery dates

This provides a seamless real-time experience for order management and tracking.
