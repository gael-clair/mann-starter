// tslint:

import { NestLikeLoggerService } from '@app/logger/services';

describe('NestLikeLoggerService', () => {
  let service: NestLikeLoggerService;
  let winstonLogger;
  const message = 'message';
  const context = 'context';
  const trace = 'trace';

  beforeAll(async () => {
    winstonLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };
    service = new NestLikeLoggerService(winstonLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('log()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should log a message at info level', () => {
      service.log(message);

      expect(winstonLogger.info).toHaveBeenCalledWith(message, { context: undefined });
    });

    it('should log a message and context at info level', () => {
      service.log(message, context);

      expect(winstonLogger.info).toHaveBeenCalledWith(message, { context });
    });
  });

  describe('info()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should log a message at info level', () => {
      service.info(message);

      expect(winstonLogger.info).toHaveBeenCalledWith(message, { context: undefined });
    });

    it('should log a message and context at info level', () => {
      service.info(message, context);

      expect(winstonLogger.info).toHaveBeenCalledWith(message, { context });
    });
  });

  describe('error()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should log a message at error level', () => {
      service.error(message);

      expect(winstonLogger.error).toHaveBeenCalledWith(message, {
        trace: undefined,
        context: undefined,
      });
    });

    it('should log a message and context at error level', () => {
      service.error(message, undefined, context);

      expect(winstonLogger.error).toHaveBeenCalledWith(message, {
        trace: undefined,
        context,
      });
    });

    it('should log a message and trace at error level', () => {
      service.error(message, trace);

      expect(winstonLogger.error).toHaveBeenCalledWith(message, {
        trace,
        context: undefined,
      });
    });

    it('should log a message, context and trace at error level', () => {
      service.error(message, trace, context);

      expect(winstonLogger.error).toHaveBeenCalledWith(message, {
        trace,
        context,
      });
    });
  });

  describe('warn()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should log a message at warn level', () => {
      service.warn(message);

      expect(winstonLogger.warn).toHaveBeenCalledWith(message, { context: undefined });
    });

    it('should log a message and context at warn level', () => {
      service.warn(message, context);

      expect(winstonLogger.warn).toHaveBeenCalledWith(message, { context });
    });
  });

  describe('verbose()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should log a message at verbose level', () => {
      service.verbose(message);

      expect(winstonLogger.verbose).toHaveBeenCalledWith(message, { context: undefined });
    });

    it('should log a message and context at verbose level', () => {
      service.verbose(message, context);

      expect(winstonLogger.verbose).toHaveBeenCalledWith(message, { context });
    });
  });

  describe('debug()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should log a message at debug level', () => {
      service.debug(message);

      expect(winstonLogger.debug).toHaveBeenCalledWith(message, { context: undefined });
    });

    it('should log a message and context at debug level', () => {
      service.debug(message, context);

      expect(winstonLogger.debug).toHaveBeenCalledWith(message, { context });
    });
  });
});
