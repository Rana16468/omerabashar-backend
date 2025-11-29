import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  send_email: {
    nodemailer_email: process.env.NODEMAILER_EMAIL,
    nodemailer_password: process.env.NODEMAILER_PASSWORD,
  },
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  expires_in: process.env.EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  refresh_expires_in: process.env.REFRESH_EXPIRES_IN,
  file_path: process.env.FILE_PATH,
  host: process.env.HOST,
  annual_price: process.env.ANNUAL_PRICE,
  s3_bucket: {
    aws_bucket_accesskey: process.env.AWS_BUCKET_ACCESS_KEY,
    aws_bucket_secret_key: process.env.AWS_BUCKET_SECRET_KEY,
    aws_bucket_region: process.env.AWS_BUCKET_REGION,
    aws_bucket_name: process.env.AWS_BUCKET_NAME,
  },
  gemini_api_key: process.env.GEMINI_API_KEY,
  gemini_ai_url: process.env.GEMINI_AI_URL,
   paypal: {
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
    mode: process.env.PAYPAL_MODE,
    paypal_campaign_run_payment_success_url:
      process.env.PAYPAL_CAMPAIGN_RUN_PAYMENT_SUCCESS_URL,
    paypal_campaign_run_payment_cancel_url:
      process.env.PAYPAL_CAMPAIGN_RUN_PAYMENT_CANCEL_URL,
    payment_capture_url: process.env.PAYPAL_PAYMENT_CAPTURE_URL,
    base_url: process.env.PAYPAL_BASE_URL,
    paypal_onboarding_success: process.env.PAYPAL_ONBOARDING_SUCCESS,
    paypal_onboarding_failed: process.env.PAYPAL_ONBOARDING_FAILED,
  },
};
