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
