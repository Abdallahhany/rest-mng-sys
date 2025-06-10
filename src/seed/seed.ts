import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CustomersService } from '../modules/customers/customers.service';
import { ProductsService } from '../modules/products/products.service';
import { CreateCustomerDto } from '../modules/customers/dto/create-customer.dto';
import { CreateProductDto } from '../modules/products/dto/create-product.dto';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger('Seed');

  const customersService = app.get(CustomersService);
  const productsService = app.get(ProductsService);

  // Clear previous data if necessary
//   await customersService['customerModel'].deleteMany({});
//   await productsService['productModel'].deleteMany({});

  const customers: CreateCustomerDto[] = [
    { name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321' },
  ];

  const products: CreateProductDto[] = [
    { name: 'Burger', price: 50, description: 'Tasty beef burger', quantity: 5 },
    { name: 'Pizza', price: 100, description: 'Cheesy delicious pizza', quantity: 3 },
    { name: 'Coke', price: 20, quantity: 10 },
  ];

  for (const customer of customers) {
    await customersService.create(customer);
    logger.log(`Inserted customer: ${customer.name}`);
  }

  for (const product of products) {
    await productsService.create(product);
    logger.log(`Inserted product: ${product.name}`);
  }

  logger.log('✅ Seeding completed');
  await app.close();
}

bootstrap();
