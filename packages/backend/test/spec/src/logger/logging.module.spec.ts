import { Test, TestingModule } from '@nestjs/testing';

import { LoggingModule } from '@app/logger/logging.module';
import { createLoggerProviders } from '@app/logger/providers';
import { LoggerService } from '@app/logger/services';

jest.mock('@app/logger/utils');
jest.mock('@app/logger/providers', () => ({ createLoggerProviders: jest.fn() }));

describe('LoggerModule', () => {
  let app: TestingModule;
  let module: LoggingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({ imports: [LoggingModule] }).compile();
    module = app.get<LoggingModule>(LoggingModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  describe('forRoot()', () => {
    it('should return a module with two providers', () => {
      const mockLoggerProvider = { provide: 'logger' };
      (createLoggerProviders as jest.Mock).mockReturnValue([mockLoggerProvider]);

      const moduleForRoot = LoggingModule.forRoot();

      expect(moduleForRoot.providers.length).toBe(2);
      expect(moduleForRoot.providers).toEqual(
        expect.arrayContaining([LoggerService, expect.objectContaining(mockLoggerProvider)]),
      );
    });
  });
});
