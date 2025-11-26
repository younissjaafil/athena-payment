import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { WhishApiException } from '../../../infrastructure/whish/exceptions/whish-api.exception';
import {
  PaymentDomainException,
  PaymentNotFoundException,
  PaymentExpiredException,
} from '../../../domain/payment/exceptions/payment.exceptions';

/**
 * Payment Exception Filter
 * Transforms domain and infrastructure exceptions to HTTP responses
 */
@Catch(WhishApiException, PaymentDomainException)
export class PaymentExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PaymentExceptionFilter.name);

  catch(
    exception: WhishApiException | PaymentDomainException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: HttpStatus;
    let errorResponse: ErrorResponse;

    if (exception instanceof WhishApiException) {
      status = this.mapWhishStatusToHttp(exception.statusCode);
      errorResponse = {
        statusCode: status,
        error: exception.code || 'PAYMENT_GATEWAY_ERROR',
        message: exception.message,
        details: exception.details,
        timestamp: new Date().toISOString(),
      };
    } else if (exception instanceof PaymentDomainException) {
      status = this.mapDomainExceptionToHttp(exception);
      errorResponse = {
        statusCode: status,
        error: exception.code,
        message: exception.message,
        timestamp: new Date().toISOString(),
      };
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = {
        statusCode: status,
        error: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      };
    }

    this.logger.error(
      `Payment error: ${errorResponse.error} - ${errorResponse.message}`,
    );

    response.status(status).json(errorResponse);
  }

  private mapWhishStatusToHttp(statusCode: number): HttpStatus {
    if (statusCode >= 400 && statusCode < 500) {
      return statusCode as HttpStatus;
    }
    if (statusCode >= 500) {
      return HttpStatus.BAD_GATEWAY;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private mapDomainExceptionToHttp(
    exception: PaymentDomainException,
  ): HttpStatus {
    if (exception instanceof PaymentNotFoundException) {
      return HttpStatus.NOT_FOUND;
    }
    if (exception instanceof PaymentExpiredException) {
      return HttpStatus.GONE;
    }
    return HttpStatus.BAD_REQUEST;
  }
}

interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  details?: unknown;
  timestamp: string;
}
