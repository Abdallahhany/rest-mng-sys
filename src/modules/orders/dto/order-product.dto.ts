import { IsMongoId, IsNumber, Min } from 'class-validator';

export class OrderProductDto {
  @IsMongoId({ message: 'productId must be a valid Mongo ID' })
  productId: string;

  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
