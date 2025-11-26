/**
 * Whish API Response Types
 */

export interface WhishBalanceResponse {
  balance: number;
  pending: number;
  currency: string;
  timestamp: string;
}

export interface WhishCreatePaymentRequest {
  amount: number;
  currency: string;
  description?: string;
  merchant_reference?: string;
  customer_email?: string;
  customer_phone?: string;
  redirect_url?: string;
  webhook_url?: string;
  expires_in?: number;
}

export interface WhishPaymentResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payment_url: string;
  merchant_reference: string;
  created_at: string;
  expires_at?: string;
}

export interface WhishStatusResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  payment_url: string;
  merchant_reference: string;
  created_at: string;
  expires_at?: string;
  paid_at?: string;
  cancelled_at?: string;
}

export interface WhishErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}
