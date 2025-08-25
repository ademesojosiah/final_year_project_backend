export type OrderStatus =
  | "In Production"
  | "In Printing"
  | "In Binding"
  | "Packaging"
  | "Delivery";

export type SheetType = "Fliers" | "OMR Sheets" | "Jotters";

export interface Order {
  batchId: string;
  orderId: string;
  customerName: string;
  productName: string;
  sheetType: SheetType;
  quantity: number;
  deliverySchedule: string;
  dateIssued: string;
  status: OrderStatus;
}

export interface CreateOrderDto {
  productName: string;
  quantity: number;
  sheetType: SheetType;
  deliverySchedule: string;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  deliverySchedule?: string;
  quantity?: number;
}

// Interface for the real-time update event data
// Backend should send data in this format via WebSocket
export interface OrderUpdateEvent {
  orderId: string;                    // The order ID being updated
  status: OrderStatus;                // New status of the order
  estimatedDate?: string;             // Optional: Updated estimated completion date
  timestamp: string;                  // ISO timestamp of when update occurred
  message?: string;                   // Optional: Custom message to display to user
}

// Interface for the real-time order creation event data
export interface OrderCreatedEvent {
  orderId: string;                    // The newly created order ID
  customerName: string;               // Customer name
  productName: string;                // Product name
  quantity: number;                   // Order quantity
  sheetType: SheetType;               // Type of sheets
  status: OrderStatus;   
  dateIssued: string;             // Initial status (usually "In Production")
  estimatedDate: string;              // Estimated delivery date
  timestamp: string;                  // ISO timestamp of when order was created
  message?: string;                   // Optional: Custom message to display to user
}
