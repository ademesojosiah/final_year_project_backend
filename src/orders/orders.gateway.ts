import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Order } from '../types/order.types';

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
    this.server.to('orders').emit('orderCreated', {
      message: 'New order created',
      order,
      timestamp: new Date().toISOString(),
    });
  }

  emitOrderUpdated(order: Order) {
    this.server.to('orders').emit('orderUpdated', {
      message: 'Order updated',
      order,
      timestamp: new Date().toISOString(),
    });
  }

  emitOrderDeleted(orderId: string) {
    this.server.to('orders').emit('orderDeleted', {
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
