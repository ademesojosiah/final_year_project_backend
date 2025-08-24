import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request,
  ValidationPipe 
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from '../dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersGateway } from './orders.gateway';

@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private ordersGateway: OrdersGateway,
  ) {}

  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get('search')
  getOrdersByCustomer(@Query('customer') customerName: string) {
    return this.ordersService.getOrdersByCustomer(customerName);
  }

  @Get(':id')
  getOrderById(@Param('id') orderId: string) {
    const order = this.ordersService.getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  @Post()
  createOrder(@Body(ValidationPipe) createOrderDto: CreateOrderDto, @Request() req) {
    // const customerName = req.user.username; // Get customer name from authenticated user
    const newOrder = this.ordersService.createOrder(createOrderDto);
    
    // Emit WebSocket event for new order
    this.ordersGateway.emitOrderCreated(newOrder);
    
    return newOrder;
  }

  @Put(':id')
  updateOrder(
    @Param('id') orderId: string, 
    @Body(ValidationPipe) updateOrderDto: UpdateOrderDto
  ) {
    const updatedOrder = this.ordersService.updateOrder(orderId, updateOrderDto);
    if (!updatedOrder) {
      throw new Error('Order not found');
    }
    
    // Emit WebSocket event for order update
    this.ordersGateway.emitOrderUpdated(updatedOrder);
    
    return updatedOrder;
  }
  

  @Delete(':id')
  deleteOrder(@Param('id') orderId: string) {
    const deleted = this.ordersService.deleteOrder(orderId);
    if (!deleted) {
      throw new Error('Order not found');
    }
    
    // Emit WebSocket event for order deletion
    this.ordersGateway.emitOrderDeleted(orderId);
    
    return { message: 'Order deleted successfully' };
  }
}
