import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily')
  async getDailySalesReport(@Query('date') date: string) {
    if (!date)
      throw new BadRequestException(
        'Date query param is required (YYYY-MM-DD)',
      );

    return this.reportsService.getDailySalesReport(date);
  }
}
