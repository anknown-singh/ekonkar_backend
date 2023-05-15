require("dotenv").config();

const Joi = require("joi");

const envVarsSchema = Joi.object()
  .keys({
    MONGODB_URL: Joi.string().required(),
    MONGODB_LOCAL: Joi.string().required(),
    NODE_ENV: Joi.string()
      .valid("production", "development", "local", "test")
      .required(),
    BYPASSOTP: Joi.boolean()
      .required()
      .description("By Pass OTP { true | false }"),
    HOST: Joi.string().required(),
    PORT: Joi.number().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().required(),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().required(),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().required(),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().required(),
    COOKIE_SECRET: Joi.string().required(),
    AWS_REGION: Joi.string().required(),
    AWS_BUCKET_NAME: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  bypassOTP: envVars.BYPASSOTP,
  db: {
    url:
      (envVars.NODE_ENV !== "local"
        ? envVars.MONGODB_URL
        : envVars.MONGODB_LOCAL) + (envVars.NODE_ENV === "test" ? "-test" : ""),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    accessSecret: envVars.JWT_SECRET,
    refreshSecret: envVars.JWT_SECRET,
    accessTokenLife: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshTokenLife: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    cookieOptions: {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      signed: true,
    },
  },
  aws: {
    bucket: envVars.AWS_BUCKET_NAME,
    fileURL: `https://s3-${envVars.AWS_REGION}.amazonaws.com/${envVars.AWS_BUCKET_NAME}`,
    accessKeyId: envVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    region: envVars.AWS_REGION,
    sesSenderAddress: "monkeyandbanana@gmail.com",
  },
  // nodemailer: {
  //   sender: envVars.NODEMAILER_EMAIL_SENDER,
  //   pass: envVars.NODEMAILER_EMAIL_PASS,
  // },
};
