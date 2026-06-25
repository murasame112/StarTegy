import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '.env')
});

export const connectionString = process.env.MONGO_CONNECTION_STRING!;
export const secret = process.env.JWT_SECRET!;
export const verificationSecret = process.env.VERIFICATION_SECRET!;
export const resetPasswordSecret = process.env.RESET_PASSWORD_SECRET!;

export const resendApiKey = process.env.RESEND_API_KEY!;
export const domainEmail = process.env.EMAIL_DOMAIN!;