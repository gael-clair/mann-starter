import * as Joi from '@hapi/joi';

import { API_BASE, LOG_LEVEL, PRODUCTION, SERVER_URL } from '../constants';

/**
 * Application configuration schema.
 */
export const envSchema: Joi.ObjectSchema = Joi.object().keys({
  [PRODUCTION]: Joi.boolean().required(),
  [SERVER_URL]: Joi.string().required(),
  [API_BASE]: Joi.string().required(),
  [LOG_LEVEL]: Joi.string()
    .valid('ERROR', 'WARN', 'INFO', 'DEBUG')
    .required()
    .default('WARN'),
});
