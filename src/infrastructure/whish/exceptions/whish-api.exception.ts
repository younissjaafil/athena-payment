/**
 * Whish API Exception - Custom exception for Whish API errors
 */
export class WhishApiException extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code?: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'WhishApiException';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      details: this.details,
    };
  }

  static fromAxiosError(error: any): WhishApiException {
    const response = error.response;
    if (response) {
      return new WhishApiException(
        response.data?.message || error.message,
        response.status,
        response.data?.code,
        response.data?.details,
      );
    }
    return new WhishApiException(error.message, 500, 'NETWORK_ERROR');
  }
}
