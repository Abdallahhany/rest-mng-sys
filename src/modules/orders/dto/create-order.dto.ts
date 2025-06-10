import { IsMongoId, IsNotEmpty, IsNumber,ValidateNested, IsArray, IsOptional, ArrayMinSize } from 'class-validator';
import { OrderProductDto } from './order-product.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  customer: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];

  @IsNumber()
  @IsOptional()
  totalPrice?: number;

}
