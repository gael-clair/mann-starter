// tslint:

import { Test } from '@nestjs/testing';

import { LoggerService } from '@app/logger/services';

describe('LoggerService', () => {
  let service: LoggerService;
  let winstonLogger;
  const message = 'message';
  const data = { test: 'test' };
  const error = new Error('test');

  beforeAll(async () => {
    winstonLogger = { log: jest.fn() };
    const app = await Test.createTestingModule({ providers: [LoggerService] }).compile();
    service = await app.resolve<LoggerService>(LoggerService);
    service.logger = winstonLogger;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('log()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should log a given log entry', () => {
      const logEntry = {
        context: 'Object',
        level: 'info',
        message: 'test',
      };

      service.log(logEntry);

      expect(winstonLogger.log).toHaveBeenCalledWith(logEntry);
    });
  });

  describe('silly()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should log a message at silly level', () => {
      service.silly(message);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'silly',
        message,
        data: undefined,
        context: 'Object',
      });
    });

    it('should log a message at silly level with data', () => {
      service.silly(message, data);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'silly',
        message,
        data,
        context: 'Object',
      });
    });

    it('should log a message at silly level with an Error', () => {
      service.silly(message, error);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'silly',
        message,
        data: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
        context: 'Object',
      });
    });
  });

  describe('debug()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should log a message at debug level', () => {
      service.debug(message);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'debug',
        message,
        data: undefined,
        context: 'Object',
      });
    });

    it('should log a message at debug level with data', () => {
      service.debug(message, data);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'debug',
        message,
        data,
        context: 'Object',
      });
    });

    it('should log a message at debug level with an Error', () => {
      service.debug(message, error);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'debug',
        message,
        data: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
        context: 'Object',
      });
    });
  });

  describe('verbose()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should log a message at verbose level', () => {
      service.verbose(message);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'verbose',
        message,
        data: undefined,
        context: 'Object',
      });
    });

    it('should log a message at verbose level with data', () => {
      service.verbose(message, data);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'verbose',
        message,
        data,
        context: 'Object',
      });
    });

    it('should log a message at verbose level with an Error', () => {
      service.verbose(message, error);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'verbose',
        message,
        data: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
        context: 'Object',
      });
    });
  });

  describe('info()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should log a message at info level', () => {
      service.info(message);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'info',
        message,
        data: undefined,
        context: 'Object',
      });
    });

    it('should log a message at info level with data', () => {
      service.info(message, data);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'info',
        message,
        data,
        context: 'Object',
      });
    });

    it('should log a message at info level with an Error', () => {
      service.info(message, error);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'info',
        message,
        data: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
        context: 'Object',
      });
    });
  });

  describe('warn()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should log a message at warn level', () => {
      service.warn(message);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'warn',
        message,
        data: undefined,
        context: 'Object',
      });
    });

    it('should log a message at warn level with data', () => {
      service.warn(message, data);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'warn',
        message,
        data,
        context: 'Object',
      });
    });

    it('should log a message at warn level with an Error', () => {
      service.warn(message, error);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'warn',
        message,
        data: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
        context: 'Object',
      });
    });
  });

  describe('error()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should log a message at error level', () => {
      service.error(message);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'error',
        message,
        data: undefined,
        context: 'Object',
      });
    });

    it('should log a message at error level with data', () => {
      service.error(message, data);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'error',
        message,
        data,
        context: 'Object',
      });
    });

    it('should log a message at error level with an Error', () => {
      service.error(message, error);

      expect(winstonLogger.log).toHaveBeenCalledWith({
        level: 'error',
        message,
        data: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
        context: 'Object',
      });
    });
  });
});
