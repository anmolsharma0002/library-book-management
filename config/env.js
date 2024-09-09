const dotenv = require('dotenv');

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

// Centralized env configuration object
const env = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || 4000,
  mongoURI: process.env.MONGO_URI,
  tokenSecret: process.env.JWT_TOKEN_SECRET_KEY,
  tokenIssuer: process.env.TOKEN_ISSUER
};

module.exports = env;
