// tslint:

import { config } from 'dotenv';
import * as fsExtra from 'fs-extra';

import { ENV_SCHEMA } from '@app/core/config/schemas';
import {
  getNumberFromEnv,
  getBooleanFromEnv,
  getFromEnv,
  getStringFromEnv,
  validateEnvConfig,
} from '@app/core/config/utils';

jest.mock('dotenv');
jest.mock('fs-extra');
jest.mock('@app/core/config/constants', () => ({
  FOLDER_ENV: '',
  NODE_ENV: 'NODE_ENV',
}));
jest.mock('@app/core/config/schemas', () => ({ ENV_SCHEMA: { validate: jest.fn() } }));

describe('Config Utils', () => {
  describe('validateEnvConfig()', () => {
    const conf = { TEST: 'test' };

    it('should load configuration from NODE_ENV.env file', async () => {
      process.env.NODE_ENV = 'test';

      (fsExtra.existsSync as jest.Mock).mockReturnValue(true);
      ENV_SCHEMA.validate.mockReturnValue({ value: conf });

      validateEnvConfig();

      expect(fsExtra.existsSync).toHaveBeenCalledWith('test.env');
      expect(config).toHaveBeenCalledWith({ path: 'test.env' });
      expect(process.env.TEST).toBe('test');
    });

    it('should load configuration from .env file in production', async () => {
      process.env.NODE_ENV = 'production';
      (fsExtra.existsSync as jest.Mock).mockReturnValue(true);
      ENV_SCHEMA.validate.mockReturnValue({ value: conf });

      validateEnvConfig();

      expect(fsExtra.existsSync).toHaveBeenCalledWith('.env');
      expect(config).toHaveBeenCalledWith({ path: '.env' });
      expect(process.env.TEST).toBe('test');
    });

    it('should throw an Error if configuration validation fails', async () => {
      process.env.NODE_ENV = 'production';
      const error = { message: 'error' };
      (fsExtra.existsSync as jest.Mock).mockReturnValue(false);
      ENV_SCHEMA.validate.mockReturnValue({ error });

      expect(() => validateEnvConfig()).toThrowError(`Error during configuration validation: ${error.message}`);
    });
  });

  describe('getFromEnv()', () => {
    beforeAll(() => {
      process.env.NUM = '10';
    });

    it('should return a value from environment', async () => {
      expect(getFromEnv('NUM')).toBe('10');
    });

    it('should return undefined when given key does not exist in environment', async () => {
      expect(getFromEnv('NO_VALUE')).toBeUndefined();
    });
  });

  describe('getStringFromEnv()', () => {
    beforeAll(() => {
      process.env.STR = 'test';
    });

    it('should return a string value from environment', async () => {
      const str = getStringFromEnv('STR');

      expect(typeof str).toBe('string');
      expect(str).toBe('test');
    });

    it('should return undefined when given key does not exist in environment', async () => {
      expect(getStringFromEnv('NO_VALUE')).toBeUndefined();
    });
  });

  describe('getBooleanFromEnv()', () => {
    beforeAll(() => {
      process.env.BOOL_TRUE = 'true';
      process.env.BOOL_FALSE = 'false';
      process.env.BOOL_NOT_VALID = 'test';
    });

    it('should return true from environment', async () => {
      const bool = getBooleanFromEnv('BOOL_TRUE');

      expect(typeof bool).toBe('boolean');
      expect(bool).toBe(true);
    });

    it('should return false from environment', async () => {
      const bool = getBooleanFromEnv('BOOL_FALSE');

      expect(typeof bool).toBe('boolean');
      expect(bool).toBe(false);
    });

    it('should return undefined when given key does not exist in environment', async () => {
      expect(getBooleanFromEnv('NO_VALUE')).toBeUndefined();
    });

    it('should throw a TypeError when environment value is not a valid boolean (true or false)', async () => {
      expect(() => getBooleanFromEnv('BOOL_NOT_VALID')).toThrowError(`Value could not be converted to boolean: test`);
    });
  });

  describe('getNumberFromEnv()', () => {
    beforeAll(() => {
      process.env.NUM = '10';
      process.env.NUM_NOT_VALID = 'test';
    });

    it('should return a number value from environment', async () => {
      const num = getNumberFromEnv('NUM');

      expect(typeof num).toBe('number');
      expect(num).toBe(10);
    });

    it('should return undefined when given key does not exist in environment', async () => {
      expect(getNumberFromEnv('NO_VALUE')).toBeUndefined();
    });

    it('should throw a TypeError when environment value is not a valid number', async () => {
      expect(() => getNumberFromEnv('NUM_NOT_VALID')).toThrowError(`Value could not be converted to number: test`);
    });
  });
});
