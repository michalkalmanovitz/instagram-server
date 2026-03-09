export default {
  credentials: {
    tenantID: process.env.AZURE_TENANT_ID,
    clientID: process.env.AZURE_CLIENT_ID,
  },
  metadata: {
    authority: 'login.microsoftonline.com',
    discovery: '.well-known/openid-configuration',
    version: 'v2.0',
    scope: ['access'],
  },
  settings: {
    validateIssuer: true,
    passReqToCallback: false,
    loggingLevel: 'info' as const,
  },
};
