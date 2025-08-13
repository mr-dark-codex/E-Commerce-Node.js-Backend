import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 8000,
  env: process.env.NODE_ENV || 'development',
  db: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  stripeKey: process.env.STRIPE_SECRET_KEY,
};
