import { SELF_DECLARED_DEPS_METADATA } from '@nestjs/common/constants';

import { AppLogger, Logger } from '@app/logger/decorators';
import { addLogger } from '@app/logger/utils';

jest.mock('@app/logger/providers', () => ({
  getLoggerProviderToken: jest.fn().mockImplementation((name?: string) => `lsf${name}`),
}));
jest.mock('@app/logger/utils', () => ({ addLogger: jest.fn() }));

describe('Logger decorators', () => {
  class Test {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
    constructor(@AppLogger() appLogger, @Logger('test') logger) {}
  }

  describe('AppLogger()', () => {
    it('should inject a logger service for app', () => {
      const metadata = Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, Test);

      expect(metadata).toContainEqual({
        index: 0,
        param: 'lsfApp',
      });
    });
  });

  describe('Logger()', () => {
    it('should register a new logger name and inject a logger service for given name', () => {
      const metadata = Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, Test);

      expect(addLogger).toHaveBeenCalledWith('test');
      expect(metadata).toContainEqual({
        index: 1,
        param: 'lsftest',
      });
    });
  });
});
