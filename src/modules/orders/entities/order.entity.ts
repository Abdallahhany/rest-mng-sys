// src/order/entities/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true }) // adds createdAt and updatedAt automatically
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ])
  products: {
    productId: Types.ObjectId;
    quantity: number;
  }[];

  @Prop({ type: Number, required: true, min: 0 })
  totalPrice: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
