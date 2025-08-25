import { Injectable } from '@nestjs/common';
import { Order, CreateOrderDto, UpdateOrderDto } from '../types/order.types';
import { mockOrders } from '../data/mock-orders';
import { log } from 'console';

@Injectable()
export class OrdersService {
  private orders: Order[] = [...mockOrders]; // Copy mock data

  getAllOrders(): Order[] {
    // Sort orders by dateIssued (newest first)
    return this.orders.sort((a, b) => {
      const dateA = new Date(a.dateIssued.split('/').reverse().join('-'));
      const dateB = new Date(b.dateIssued.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    });
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders.find(order => order.orderId === orderId);
  }

  getOrdersByCustomer(customerName: string): Order[] {
    return this.orders.filter(order => 
      order.customerName.toLowerCase().includes(customerName.toLowerCase())
    );
  }

  createOrder(createOrderDto: CreateOrderDto): Order {
    log('Creating order:', createOrderDto);
    const newOrder: Order = {
      batchId: this.generateBatchId(),
      orderId: this.generateOrderId(),
      customerName: "josiah",
      productName: createOrderDto.productName,
      sheetType: createOrderDto.sheetType,
      quantity: createOrderDto.quantity,
      deliverySchedule: createOrderDto.deliverySchedule || this.calculateDeliverySchedule(),
      dateIssued: new Date().toLocaleDateString('en-GB'),
      status: "In Production",
    };

    // Add new order at the beginning (newest first)
    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrder(orderId: string, updateOrderDto: UpdateOrderDto): Order | null {
    const orderIndex = this.orders.findIndex(order => order.orderId === orderId);
    
    if (orderIndex === -1) {
      return null;
    }

    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      ...updateOrderDto,
    };

    return this.orders[orderIndex];
  }

  deleteOrder(orderId: string): boolean {
    const orderIndex = this.orders.findIndex(order => order.orderId === orderId);
    
    if (orderIndex === -1) {
      return false;
    }

    this.orders.splice(orderIndex, 1);
    return true;
  }

  private generateBatchId(): string {
    return Date.now().toString();
  }

  private generateOrderId(): string {
    let orderId: string;
    let fiveDigitNumber: number;
    
    // Keep generating until we find a unique ID
    do {
      fiveDigitNumber = Math.floor(10000 + Math.random() * 90000);
      orderId = `ORD-${fiveDigitNumber}`;
    } while (this.orders.some(order => order.orderId === orderId));
    
    return orderId;
  }

  private calculateDeliverySchedule(): string {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 7); // 7 days from now
    
    return deliveryDate.toLocaleDateString('en-GB');
  }
}
