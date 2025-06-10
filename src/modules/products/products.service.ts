import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Enter a valid ID`);
    }
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async getProductsByIds(
    ids: string[],
  ): Promise<Product[]> {

    const products = await this.productModel
      .find({ _id: { $in: ids } })
      .exec();

    return products;
  }

  async decreaseQuantity(productId: string, quantity: number): Promise<void> {
  const product = await this.productModel.findById(productId);
  if (!product) throw new NotFoundException(`Product not found`);

  if (product.quantity < quantity) {
    throw new BadRequestException(`Not enough stock for product: ${product.name}`);
  }

  product.quantity -= quantity;
  await product.save();
}

}
