/**
 * Domain Exceptions for Payment
 * Following DDD principles for domain-specific errors
 */

export class PaymentDomainException extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'PaymentDomainException';
  }
}

export class PaymentNotFoundException extends PaymentDomainException {
  constructor(paymentId: string) {
    super(`Payment with ID ${paymentId} not found`, 'PAYMENT_NOT_FOUND');
    this.name = 'PaymentNotFoundException';
  }
}

export class PaymentAlreadyProcessedException extends PaymentDomainException {
  constructor(paymentId: string) {
    super(
      `Payment with ID ${paymentId} has already been processed`,
      'PAYMENT_ALREADY_PROCESSED',
    );
    this.name = 'PaymentAlreadyProcessedException';
  }
}

export class PaymentExpiredException extends PaymentDomainException {
  constructor(paymentId: string) {
    super(`Payment with ID ${paymentId} has expired`, 'PAYMENT_EXPIRED');
    this.name = 'PaymentExpiredException';
  }
}

export class InsufficientBalanceException extends PaymentDomainException {
  constructor() {
    super('Insufficient balance to process payment', 'INSUFFICIENT_BALANCE');
    this.name = 'InsufficientBalanceException';
  }
}

export class InvalidCurrencyException extends PaymentDomainException {
  constructor(currency: string) {
    super(`Invalid currency: ${currency}`, 'INVALID_CURRENCY');
    this.name = 'InvalidCurrencyException';
  }
}
