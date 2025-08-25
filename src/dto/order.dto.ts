import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { SheetType, OrderStatus } from '../types/order.types';

export class CreateOrderDto {
  @IsString()
  customerName: string;

  @IsString()
  productName: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsEnum(['Fliers', 'OMR Sheets', 'Jotters'])
  sheetType: SheetType;

  deliverySchedule: string;

}

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(['In Production', 'In Printing', 'In Binding', 'Packaging', 'Delivery'])
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  deliverySchedule?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;
}
