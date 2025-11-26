import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): { status: string; service: string; timestamp: string } {
    return {
      status: 'Successful',
      service: 'Payment Microservice is Running',
      timestamp: new Date().toISOString(),
    };
  }
}
