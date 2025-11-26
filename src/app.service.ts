import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Athena Payment Gateway - Powered by Whish';
  }
}
