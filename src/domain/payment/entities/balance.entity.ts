/**
 * Balance Entity - Represents account balance information
 */
export class Balance {
  constructor(
    public readonly available: number,
    public readonly pending: number,
    public readonly currency: string,
    public readonly lastUpdated: Date,
  ) {}

  get total(): number {
    return this.available + this.pending;
  }

  hasAvailableFunds(amount: number): boolean {
    return this.available >= amount;
  }
}
