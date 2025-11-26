/**
 * Payment Entity - Core domain entity representing a payment
 * Following DDD principles, this entity encapsulates payment business logic
 */
export class Payment {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly currency: Currency,
    public readonly status: PaymentStatus,
    public readonly paymentUrl: string,
    public readonly merchantReference: string,
    public readonly createdAt: Date,
    public readonly expiresAt?: Date,
  ) {}

  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  isCompleted(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  isFailed(): boolean {
    return this.status === PaymentStatus.FAILED;
  }
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum Currency {
  USD = 'USD',
  LBP = 'LBP',
  AED = 'AED',
}
