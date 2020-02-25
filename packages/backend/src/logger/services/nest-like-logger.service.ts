import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';

/**
 * A Nestjs like logger service based on a Winston logger.
 */
export class NestLikeLoggerService implements LoggerService {
  /**
   * Returns an instance of NestLikeLoggerService.
   * @param logger instance of winston logger
   */
  constructor(private readonly logger: winston.Logger) {}

  /**
   * Logs a message and context at info level.
   * @param message message to log
   * @param context context of log
   */
  log(message: any, context?: string): void {
    this.logger.info(message, { context });
  }

  /**
   * Logs a message and context at info level.
   * @param message message to log
   * @param context context of log
   */
  info(message: any, context?: string): void {
    this.logger.info(message, { context });
  }

  /**
   * Logs a message and context at error level.
   * @param message message to log
   * @param context context of log
   */
  error(message: any, trace?: string, context?: string): void {
    this.logger.error(message, { trace, context });
  }

  /**
   * Logs a message and context at warn level.
   * @param message message to log
   * @param context context of log
   */
  warn(message: any, context?: string): void {
    this.logger.warn(message, { context });
  }

  /**
   * Logs a message and context at debug level.
   * @param message message to log
   * @param context context of log
   */
  debug(message: any, context?: string): void {
    this.logger.debug(message, { context });
  }

  /**
   * Logs a message and context at verbose level.
   * @param message message to log
   * @param context context of log
   */
  verbose?(message: any, context?: string): void {
    this.logger.verbose(message, { context });
  }
}
