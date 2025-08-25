import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Order, OrderUpdateEvent, OrderCreatedEvent } from '../types/order.types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    client.join('orders');
    return { event: 'joinedRoom', data: 'Successfully joined orders room' };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    client.leave('orders');
    return { event: 'leftRoom', data: 'Successfully left orders room' };
  }

  // Methods to emit events to all connected clients
  emitOrderCreated(order: Order) {

    // Emit specific order creation event with detailed data
    const createdEvent: OrderCreatedEvent = {
      orderId: order.orderId,
      customerName: order.customerName,
      productName: order.productName,
      quantity: order.quantity,
      sheetType: order.sheetType,
      status: order.status,
      estimatedDate: order.deliverySchedule,
      timestamp: new Date().toISOString(),
      message: `New order ${order.orderId} created for ${order.customerName}`,
    };

    this.server.emit(`orderCreated`, createdEvent);
  }

  emitOrderUpdated(order: Order) {
    // Emit general order updated event
    this.server.emit('orderUpdated', {
      message: 'Order updated',
      order,
      timestamp: new Date().toISOString(),
    });

    // Emit specific order update event with the format "{orderId}/update"
    const updateEvent: OrderUpdateEvent = {
      orderId: order.orderId,
      status: order.status,
      estimatedDate: order.deliverySchedule,
      timestamp: new Date().toISOString(),
      message: `Order ${order.orderId} status updated to ${order.status}`,
    };

    this.server.emit(`${order.orderId}/update`, updateEvent);
  }

  emitOrderDeleted(orderId: string) {
    this.server.emit('orderDeleted', {
      message: 'Order deleted',
      orderId,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle connection events
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
