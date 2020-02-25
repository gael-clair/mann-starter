import { existsSync, mkdirSync } from 'fs-extra';
import * as winston from 'winston';
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';

import { getStringFromEnv } from '@app/core/config/utils';
import { NestLikeLoggerService } from '@app/logger/services';
import { createLogger, getNestjsLogger, getLoggerByName, addLogger, getLoggers, addLoggers } from '@app/logger/utils';

jest.mock('fs-extra');
jest.mock('@app/core/config/utils');
jest.mock('winston');
jest.mock('winston-daily-rotate-file', () => jest.fn());
jest.mock('@app/logger/services', () => ({ NestLikeLoggerService: jest.fn() }));
jest.mock('@app/logger/constants', () => ({ DEFAULT_LOGGER_ID: 'app' }));

describe('Logger utils', () => {
  describe('createLogger()', () => {
    const name = 'test';
    const name2 = 'test2';

    beforeAll(() => {
      (winston.loggers.add as jest.Mock).mockImplementation((name: string) => ({ name }));
      (winston.loggers.get as jest.Mock).mockImplementation((name: string) => ({ name }));
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create log folder and return a newly created logger', () => {
      (existsSync as jest.Mock).mockReturnValue(false);
      (winston.loggers.has as jest.Mock).mockReturnValue(false);

      expect(createLogger(name)).toEqual({ name });
      expect(mkdirSync).toHaveBeenCalled();
    });

    it('should return a newly created logger', () => {
      (existsSync as jest.Mock).mockReturnValue(true);
      (winston.loggers.has as jest.Mock).mockReturnValue(false);

      expect(createLogger(name2)).toEqual({ name: name2 });
      expect(winston.loggers.add).toHaveBeenCalledWith(name2, expect.anything());
      expect(mkdirSync).not.toHaveBeenCalled();
      expect(winston.loggers.get).not.toHaveBeenCalled();
    });

    it('should return a newly created logger without transport in test', () => {
      (getStringFromEnv as jest.Mock).mockReturnValue('test');
      (existsSync as jest.Mock).mockReturnValue(true);
      (winston.loggers.has as jest.Mock).mockReturnValue(false);

      expect(createLogger(name2)).toEqual({ name: name2 });
      expect(winston.loggers.add).toHaveBeenCalledWith(name2, expect.objectContaining({ format: [] }));
      expect(mkdirSync).not.toHaveBeenCalled();
      expect(winston.loggers.get).not.toHaveBeenCalled();
    });

    it('should return a newly created logger with file transport if environment is not test', () => {
      (getStringFromEnv as jest.Mock).mockReturnValue('not_test');

      expect(createLogger(name2)).toEqual({ name: name2 });
      expect(winston.loggers.add).toHaveBeenCalledWith(name2, expect.anything());
      expect(mkdirSync).not.toHaveBeenCalled();
      expect(winston.loggers.get).not.toHaveBeenCalled();
      expect(winston.transports.Console).not.toHaveBeenCalled();
      expect(winstonDailyRotateFile).toHaveBeenCalled();
    });

    it('should return a newly created logger with file and console transports if environment is development', () => {
      (getStringFromEnv as jest.Mock).mockReturnValue('development');

      expect(createLogger(name2)).toEqual({ name: name2 });
      expect(winston.loggers.add).toHaveBeenCalledWith(name2, expect.anything());
      expect(mkdirSync).not.toHaveBeenCalled();
      expect(winston.loggers.get).not.toHaveBeenCalled();
      expect(winston.transports.Console).toHaveBeenCalled();
      expect(winstonDailyRotateFile).toHaveBeenCalled();
    });

    it('should return an existing logger if a logger with given name already exists', () => {
      (winston.loggers.has as jest.Mock).mockReturnValue(true);

      expect(createLogger(name)).toEqual({ name });
      expect(winston.loggers.get).toHaveBeenCalledWith(name);
      expect(mkdirSync).not.toHaveBeenCalled();
      expect(winston.loggers.add).not.toHaveBeenCalled();
    });
  });

  describe('getNestjsLogger()', () => {
    it('should return a new NestLikeLoggerService with default logger', () => {
      const logger = getNestjsLogger();
      expect(logger instanceof NestLikeLoggerService).toBeTruthy();
      expect(logger.constructor as jest.Mock).toHaveBeenCalledWith({ name: 'app' });
    });

    it('should return a new NestLikeLoggerService with given named logger', () => {
      const name = 'test';
      const logger = getNestjsLogger(name);
      expect(logger instanceof NestLikeLoggerService).toBeTruthy();
      expect(logger.constructor as jest.Mock).toHaveBeenCalledWith({ name });
    });
  });

  describe('getLoggerByName()', () => {
    it('should return a Winston logger by its name', () => {
      (winston.loggers.get as jest.Mock).mockImplementation((name: string) => ({ name }));
      const name = 'test';

      expect(getLoggerByName(name)).toEqual({ name });
    });

    it('should return undefined if no logger exists with given name', () => {
      (winston.loggers.get as jest.Mock).mockReturnValue(undefined);
      const name = 'test';

      expect(getLoggerByName(name)).toEqual(undefined);
    });
  });

  describe('loggers', () => {
    describe('add and get logger name', () => {
      it('should add logger name and get it', () => {
        const name = 'test';
        addLogger(name);
        const loggers = getLoggers();
        expect(loggers.length).toBe(1);
        expect(loggers).toContain(name);
      });

      it('should add multiple logger names and get it', () => {
        const names = ['test', 'test2'];
        addLoggers(names);
        const loggers = getLoggers();
        expect(loggers.length).toBe(2);
        expect(loggers).toEqual(expect.arrayContaining(names));
      });
    });
  });
});
