export default () => ({
  app: {
    port: parseInt(process.env.PORT || '4000', 10),
    environment: process.env.NODE_ENV,
    apiPrefix: process.env.API_PREFIX,
  },
  payment: {
    serviceUrl: process.env.PAYMENT_SERVICE_URL,
    channel: process.env.WHISH_CHANNEL,
    secret: process.env.WHISH_SECRET,
    websiteUrl: process.env.WHISH_WEBSITE_URL,
  },
  gateway: {
    baseUrl: process.env.GATEWAY_BASE_URL,
  },
});
