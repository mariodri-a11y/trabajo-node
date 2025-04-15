import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const DB_STRING = process.env.DB_STRING as string;
export const APP_NAME = process.env.APP_NAME as string;
export const DB_NAME = process.env.DB_NAME as string;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
export const STRIPE_PRIZE_ID = process.env.STRIPE_PRIZE_ID as string;
