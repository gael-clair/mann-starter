import { HttpException, HttpStatus } from '@nestjs/common';

import { AllExceptionFilter } from '@app/core/filters';

jest.mock('@app/logger/services/logger.service');

describe('AllExceptionFilter', () => {
  const response = {
    status: jest.fn().mockReturnValue({
      json: jest.fn(),
    }),
  };
  const argumentsHost = {
    switchToHttp: jest.fn().mockReturnValue({
      getResponse: jest.fn().mockReturnValue(response),
    }),
  } as any;
  let allExceptionFilter: AllExceptionFilter;

  beforeEach(() => {
    allExceptionFilter = new AllExceptionFilter();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(allExceptionFilter).toBeDefined();
  });

  describe('catch()', () => {
    it('should return a response built with a HttpException', () => {
      const exception = new HttpException('response', HttpStatus.BAD_REQUEST);

      allExceptionFilter.catch(exception, argumentsHost);

      expect(argumentsHost.switchToHttp().getResponse().status).toHaveBeenCalledWith(exception.getStatus());
      expect(
        argumentsHost
          .switchToHttp()
          .getResponse()
          .status().json,
      ).toHaveBeenCalledWith(exception.getResponse());
    });

    it('should return a response with status code 500 if an Error is catched', () => {
      const exception = new Error('Error');
      const result = HttpException.createBody(
        exception.message,
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      allExceptionFilter.catch(exception, argumentsHost);

      expect(argumentsHost.switchToHttp().getResponse().status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(
        argumentsHost
          .switchToHttp()
          .getResponse()
          .status().json,
      ).toHaveBeenCalledWith(result);
    });

    it('should return a response with status code 500 if an exception not of type Error or HttpException is catched', () => {
      const error = 'error';
      const result = HttpException.createBody(error, 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);

      allExceptionFilter.catch(error, argumentsHost);

      expect(argumentsHost.switchToHttp().getResponse().status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(
        argumentsHost
          .switchToHttp()
          .getResponse()
          .status().json,
      ).toHaveBeenCalledWith(result);
    });
  });
});
