const dotenv = require('dotenv');

/**
 * @see {https://github.com/Lacka90/angular-dotenv-poc/blob/master/src/app/config/dotenv-loader.js}
 */

dotenv.config();

const env = {
  mapsKey: process.env.MAPS_KEY || '',
  functionsKey: process.env.FUNCTIONS_KEY || '',
  captchaSiteKey: process.env.CAPTCHA_SITE_KEY || '',
  APIUrl: process.env.API_URL || '',
  sentryDSN: process.env.SENTRY_DSN || '',
  tagManagerId: process.env.TAG_MANAGER_ID || '',
};

module.exports = () => {
  return { code: 'module.exports = ' + JSON.stringify(env) };
};
