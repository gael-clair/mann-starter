import { join } from 'path';

import { config } from 'dotenv';
import { existsSync } from 'fs-extra';

import { FOLDER_ENV, NODE_ENV } from '../constants';
import { ENV_SCHEMA } from '../schemas';

/**
 * Returns a converted value from environment.
 * If value could not be converted to the desired type, throws an Error.
 * @param key key of the value to convert
 * @param type type to convert the value
 */
function getAndConvert(key: string, type: string): any {
  const value = process.env[key];
  switch (type) {
    case 'boolean': // a boolean is considered at true if value is 'true' or '1' string
      if (value === 'true' || value === '1') {
        return true;
      } else if (value === 'false') {
        return false;
      } else {
        throw new TypeError(`Value could not be converted to boolean: ${value}`);
      }
    case 'number':
      const num = parseInt(value, 10);
      if (!Number.isNaN(num)) {
        return num;
      } else {
        throw new TypeError(`Value could not be converted to number: ${value}`);
      }
    case 'string':
      return value;
    default:
      throw new Error(`Type ${type} is not a valid type`);
  }
}

/**
 * Validates configuration schema against environment variables.
 * Loads a .env file to merge current environment with it before validation.
 */
export function validateEnvConfig(): void {
  const envFile = join(FOLDER_ENV, process.env[NODE_ENV] === 'production' ? '.env' : `${process.env[NODE_ENV]}.env`);
  if (existsSync(envFile)) {
    // Loads existing .env file
    config({ path: envFile });
  }
  // Validates configuration against environment variables
  const { error, value: validatedEnvConfig } = ENV_SCHEMA.validate(process.env, {
    allowUnknown: true,
    stripUnknown: true,
  });
  if (error) {
    // Validation failed
    throw new Error(`Error during configuration validation: ${error.message}`);
  }
  // Adds configuration values that not have been loaded yet
  for (const k in validatedEnvConfig) {
    if (validatedEnvConfig.hasOwnProperty(k)) {
      process.env[k] = validatedEnvConfig[k];
    }
  }
}

/**
 * Returns a value from environment by its key.
 * @param key key of the value to get
 */
export function getFromEnv(key: string): any {
  return process.env[key];
}

/**
 * Returns an array from environment by its key.
 * @param key key of the value to get
 */
export function getArrayFromEnv(key: string): any[] {
  const value = process.env[key];
  if (!Array.isArray(value)) throw new TypeError("La valeur demandée n'est pas un Array");
  return value;
}

/**
 * Returns a string from environement by its key.
 * @param key key of the value to get
 */
export function getStringFromEnv(key: string): string {
  return getAndConvert(key, 'string');
}

/**
 * Returns a boolean from environement by its key.
 * @param key key of the value to get
 */
export function getBooleanFromEnv(key: string): boolean {
  return getAndConvert(key, 'boolean') as boolean;
}

/**
 * Returns a number from environement by its key.
 * @param key key of the value to get
 */
export function getNumberFromEnv(key: string): number {
  return getAndConvert(key, 'number') as number;
}
