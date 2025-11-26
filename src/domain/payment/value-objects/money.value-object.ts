import { Currency } from '../entities/payment.entity';

/**
 * Money Value Object - Immutable representation of monetary value
 * Following DDD principles for value objects
 */
export class Money {
  private constructor(
    private readonly _amount: number,
    private readonly _currency: Currency,
  ) {
    if (_amount < 0) {
      throw new Error('Amount cannot be negative');
    }
  }

  static create(amount: number, currency: Currency): Money {
    return new Money(amount, currency);
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): Currency {
    return this._currency;
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this._amount - other._amount, this._currency);
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  private ensureSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new Error('Cannot perform operation on different currencies');
    }
  }

  toString(): string {
    return `${this._amount} ${this._currency}`;
  }
}
