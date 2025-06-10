// reports.service.ts
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../orders/entities/order.entity';
import { Model } from 'mongoose';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getDailySalesReport(date: string) {
    const cacheKey = `sales_report_${date}`;
    if (!date) throw new BadRequestException('Date is required');

    const cachedReport = await this.cacheManager.get(cacheKey);
    if (cachedReport) {
      return cachedReport;
    }


    const targetDate = new Date(date);
    const start = startOfDay(targetDate);
    const end = endOfDay(targetDate);

    const report = await this.orderModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: '$products' },
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $multiply: ['$products.quantity', '$productDetails.price'],
            },
          },
          totalOrders: { $addToSet: '$_id' },
          productSales: {
            $push: {
              productId: '$productDetails._id',
              name: '$productDetails.name',
              quantitySold: '$products.quantity',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalOrders: { $size: '$totalOrders' },
          productSales: 1,
        },
      },
      { $unwind: '$productSales' },
      {
        $group: {
          _id: '$productSales.productId',
          name: { $first: '$productSales.name' },
          totalQuantity: { $sum: '$productSales.quantitySold' },
          totalRevenue: { $first: '$totalRevenue' },
          totalOrders: { $first: '$totalOrders' },
        },
      },
      { $sort: { totalQuantity: -1 } },
      {
        $group: {
          _id: null,
          totalRevenue: { $first: '$totalRevenue' },
          totalOrders: { $first: '$totalOrders' },
          topSellingItems: {
            $push: {
              productId: '$_id',
              name: '$name',
              quantitySold: '$totalQuantity',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalOrders: 1,
          topSellingItems: 1,
        },
      },
    ]);

    // cache only past reports
    if (report.length > 0 && targetDate <= new Date()) {
      await this.cacheManager.set(cacheKey, report[0]);
    }

    return (
      report[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        topSellingItems: [],
      }
    );
  }
}
