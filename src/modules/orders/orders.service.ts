import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // check if customer already exist
    await this.customersService.findOne(createOrderDto.customer);

    // Check if all products exist, have enough quantity, and calculate total price
    const productIds = createOrderDto.products.map(
      (product) => product.productId,
    );
    const products = await this.productsService.getProductsByIds(productIds);
    if (products.length !== createOrderDto.products.length) {
      throw new NotFoundException('Some products not found');
    }
    const totalPrice = products.reduce((sum, product) => {
      const orderProduct = createOrderDto.products.find(
        (p) => p.productId === String(product._id),
      );
      if (product.quantity < (orderProduct?.quantity || 0)) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}`,
        );
      }

      return sum + product.price * (orderProduct?.quantity || 0);
    }, 0);

    // Create the order with the total price
    createOrderDto.totalPrice = totalPrice;
    // Create the order
    const createdOrder = new this.orderModel(createOrderDto);

    // Decrease the product quantities
    await Promise.all(
      createOrderDto.products.map(({ productId, quantity }) =>
        this.productsService.decreaseQuantity(productId, quantity),
      ),
    );

    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel
      .find()
      .populate('products')
      .populate('customer')
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('products')
      .populate('customer')
      .exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // Find the existing order
    const existingOrder = await this.orderModel.findById(id).exec();
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Check if customer exists (if being updated)
    if (updateOrderDto.customer) {
      await this.customersService.findOne(updateOrderDto.customer);
    }

    // If products are being updated, validate them and recalculate total price
    if (updateOrderDto.products) {
      const productIds = updateOrderDto.products.map(
        (product) => product.productId,
      );
      const products = await this.productsService.getProductsByIds(productIds);
      if (products.length !== updateOrderDto.products.length) {
        throw new NotFoundException('Some products not found');
      }
      const totalPrice = products.reduce((sum, product) => {
        const orderProduct = updateOrderDto.products?.find(
          (p) => p.productId === String(product._id),
        );
        if (product.quantity < (orderProduct?.quantity || 0)) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.name}`,
          );
        }
        return sum + product.price * (orderProduct?.quantity || 0);
      }, 0);

      updateOrderDto.totalPrice = totalPrice;

      // Optionally: Restore previous product quantities before decreasing for new ones
      // (not implemented here, but should be considered for real-world scenarios)

      // Decrease the product quantities for the new products
      await Promise.all(
        updateOrderDto.products.map(({ productId, quantity }) =>
          this.productsService.decreaseQuantity(productId, quantity),
        ),
      );
    }

    // Update the order
    Object.assign(existingOrder, updateOrderDto);
    return existingOrder.save();
  }

  async remove(id: string): Promise<Order> {
    const order = await this.orderModel.findByIdAndDelete(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
}
