import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
    constructor(
        @InjectModel(Customer.name) private customerModel: Model<Customer>,
    ) {}

    async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        const createdCustomer = new this.customerModel(createCustomerDto);
        return createdCustomer.save();
    }
    
    async findAll(): Promise<Customer[]> {
        return this.customerModel.find().exec();
    }
    
    async findOne(id: string): Promise<Customer> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(`Enter a valid ID`);
        }
        const customer = await this.customerModel.findById(id).exec();

        // should let throw error responsibility to the service which use the method
        // this is cleaner
        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
}
