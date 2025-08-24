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
