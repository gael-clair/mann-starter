// tslint:

import { getLoggerProviderToken, createLoggerProviders } from '@app/logger/providers';

jest.mock('@app/logger/utils', () => ({
  getLoggers: jest
    .fn()
    .mockReturnValueOnce(['logger1', 'logger2'])
    .mockReturnValueOnce([]),
}));

describe('Logger provider', () => {
  describe('getLoggerProviderToken()', () => {
    it('should return a logger provider token as string', () => {
      expect(getLoggerProviderToken('Test')).toBe(`LoggerServiceFortest`);
    });
  });

  describe('createLoggerProviders()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return an array with 2 providers', () => {
      const providers = createLoggerProviders();

      expect(providers.length).toEqual(2);
      expect(providers[0]).toMatchObject({ provide: 'LoggerServiceForlogger1' });
      expect(providers[1]).toMatchObject({ provide: 'LoggerServiceForlogger2' });
    });

    it('should return an empty array when no logger have been set', () => {
      expect(createLoggerProviders()).toStrictEqual([]);
    });
  });
});
