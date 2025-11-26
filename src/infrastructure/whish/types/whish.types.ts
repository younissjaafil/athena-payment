/**
 * Whish API Response Types
 */

// Generic Whish API response wrapper
export interface WhishApiResponse<T> {
  status: boolean;
  code: string | null;
  dialog: string | null;
  actions: unknown;
  extra: unknown;
  data: T;
}

export interface WhishBalanceData {
  balance: number;
}

export interface WhishBalanceResponse {
  balance: number;
  pending: number;
  currency: string;
  timestamp: string;
}

// Create Payment Request (POST /payment/whish)
export interface WhishCreatePaymentRequest {
  amount: number;
  currency: string; // LBP, USD, AED
  invoice: string; // Details/Description about the payment
  externalId: number; // ID provided by third party
  successCallbackUrl: string;
  failureCallbackUrl: string;
  successRedirectUrl: string;
  failureRedirectUrl: string;
}

// Create Payment Response
export interface WhishCreatePaymentData {
  collectUrl: string;
}

// Get Status Request (POST /payment/collect/status)
export interface WhishGetStatusRequest {
  currency: string;
  externalId: number;
}

// Get Status Response
export interface WhishStatusData {
  collectStatus: string; // success, failed, pending
  payerPhoneNumber: string;
}
