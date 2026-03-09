import helmet from 'helmet';

const TWENTY_FOUR_MONTHS_IN_SECONDS = 63072000;

const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'www.google-analytics.com'"],
      styleSrc: ["'self'", "'fonts.googleapis.com'"],
      imgSrc: ["'self'"],
      fontSrc: ["'self'", "'fonts.gstatic.com'"],
      mediaSrc: ["'self'"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      frameSrc: ["'none'"],
    },
  },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: TWENTY_FOUR_MONTHS_IN_SECONDS,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  referrerPolicy: { policy: 'no-referrer' },
  xPermittedCrossDomainPolicies: {
    permittedPolicies: 'none',
  },
  xXssProtection: true,
});

export { helmetConfig };
