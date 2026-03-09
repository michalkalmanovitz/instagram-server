import { ConfigModule as Config } from '@nestjs/config';
import Joi from 'joi';

export const ConfigModule = Config.forRoot({
  isGlobal: true,
  validationSchema: Joi.object({
    AZURE_CLIENT_ID: Joi.string().required(),
    AZURE_TENANT_ID: Joi.string().required(),
    AZURE_CLIENT_SECRET: Joi.string().required(),
    CLIENT_URL: Joi.string().required(),
    SERVER_URL: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    DB_SCHEMA: Joi.string().required(),
    JAEGER_COLLECTOR_OTLP_ENDPOINT: Joi.string().required(),
  }),
});
