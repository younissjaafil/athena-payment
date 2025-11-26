/**
 * Balance Response DTO
 */
export class BalanceResponseDto {
  available: number;
  pending: number;
  total: number;
  currency: string;
  lastUpdated: Date;

  static fromEntity(balance: {
    available: number;
    pending: number;
    total: number;
    currency: string;
    lastUpdated: Date;
  }): BalanceResponseDto {
    const dto = new BalanceResponseDto();
    dto.available = balance.available;
    dto.pending = balance.pending;
    dto.total = balance.total;
    dto.currency = balance.currency;
    dto.lastUpdated = balance.lastUpdated;
    return dto;
  }
}
