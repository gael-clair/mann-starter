import { join } from 'path';

import { alternatives, boolean, number, object, ObjectSchema, string } from '@hapi/joi';

import {
  DATABASE_URL,
  ENABLE_CORS,
  ENABLE_SSL,
  LOG_FOLDER,
  LOG_LEVEL,
  LOG_RETENTION,
  LOG_ROTATION_SIZE,
  NODE_ENV,
  PORT,
  STATIC_FOLDER,
  STATIC_SERVE,
  SSL_KEY_FILE,
  SSL_CERT_FILE,
} from '../constants';

/**
 * Schema of an environment configuration.
 */
export const ENV_SCHEMA: ObjectSchema = object().keys({
  [NODE_ENV]: string()
    .valid('development', 'production', 'test')
    .default('development'),
  [PORT]: number().default(3000),
  [STATIC_SERVE]: boolean().default(true),
  [STATIC_FOLDER]: string().default(join(process.cwd(), '../frontend/dist/frontend')),
  [LOG_FOLDER]: string().default(join(process.cwd(), 'logs')),
  [LOG_RETENTION]: alternatives()
    .try(string(), number())
    .default('3d'),
  [LOG_ROTATION_SIZE]: alternatives()
    .try(string(), number())
    .default('200m'),
  [LOG_LEVEL]: string()
    .valid('error', 'warn', 'info', 'verbose', 'debug', 'silly', 'silent')
    .default('debug'),
  [DATABASE_URL]: string().default('mongodb://localhost:27017/mann-starter'),
  [ENABLE_CORS]: boolean().default(true),
  [ENABLE_SSL]: boolean().default(false),
  [SSL_KEY_FILE]: string().default('./ssl/localhost-key.pem'),
  [SSL_CERT_FILE]: string().default('./ssl/localhost.pem'),
});
