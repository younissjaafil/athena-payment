export default () => ({
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || 'api',
  },
  payment: {
    serviceUrl: process.env.PAYMENT_SERVICE_URL || 'https://api.whish.money',
    channel: process.env.WHISH_CHANNEL || '',
    secret: process.env.WHISH_SECRET || '',
    websiteUrl: process.env.WHISH_WEBSITE_URL || '',
  },
  gateway: {
    baseUrl: process.env.GATEWAY_BASE_URL || 'https://payment.athena-ai.pro',
  },
});
