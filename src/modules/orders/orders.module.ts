import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { Product, ProductSchema } from '../products/entities/product.entity';
import { Customer, CustomerSchema } from '../customers/entities/customer.entity';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, CustomersService, ProductsService]
})
export class OrdersModule {}
