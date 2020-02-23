import { Injectable, Scope } from '@nestjs/common';
import { LogEntry, Logger as LoggerWinston } from 'winston';

/**
 * Logger service based on a Winston logger.
 */
@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService {
  /**
   * Winston logger instance.
   */
  private _logger: LoggerWinston;

  /**
   * Sets Winston logger.
   */
  public set logger(logger: LoggerWinston) {
    this._logger = logger;
  }

  /**
   * Logs an entry.
   * @param logEntry entry to log
   */
  public log(logEntry: LogEntry): void {
    const logEntryWithContext = Object.assign({}, logEntry, this.getContext());
    this._logger.log(logEntryWithContext);
  }

  /**
   * Logs a message and optional additional data at silly level.
   * @param message message to log
   * @param data additional data
   */
  public silly(message: string, data?: any): void {
    this.log({ level: 'silly', message, data: this.formatData(data) });
  }

  /**
   * Logs a message and optional additional data at debug level.
   * @param message message to log
   * @param data additional data
   */
  public debug(message: string, data?: any): void {
    this.log({ level: 'debug', message, data: this.formatData(data) });
  }

  /**
   * Logs a message and optional additional data at verbose level.
   * @param message message to log
   * @param data additional data
   */
  public verbose(message: string, data?: any): void {
    this.log({ level: 'verbose', message, data: this.formatData(data) });
  }

  /**
   * Logs a message and optional additional data at info level.
   * @param message message to log
   * @param data additional data
   */
  public info(message: string, data?: any): void {
    this.log({ level: 'info', message, data: this.formatData(data) });
  }

  /**
   * Logs a message and optional additional data at warn level.
   * @param message message to log
   * @param data additional data
   */
  public warn(message: string, data?: any): void {
    this.log({ level: 'warn', message, data: this.formatData(data) });
  }

  /**
   * Logs a message and optional additional data at error level.
   * @param message message to log
   * @param data additional data
   */
  public error(message: string, data?: any): void {
    this.log({ level: 'error', message, data: this.formatData(data) });
  }

  /**
   * Formats a data to log.
   * @param data data to format
   */
  private formatData(data?: any): any {
    if (data instanceof Error) {
      // If data is an Error, we log its name, message and stack
      return {
        message: data.message,
        name: data.name,
        stack: data.stack,
      };
    }
    return data;
  }

  /**
   * If possible gets log context to add it to log line, otherwise returns an empty object.
   * Context is extracted from current stacktrace.
   */
  private getContext(): { context: string } | {} {
    try {
      const stacklist = new Error().stack.split('\n').slice(1);
      const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
      const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;
      const s = stacklist[3] || stacklist[0];
      const sp = stackReg.exec(s) || stackReg2.exec(s);
      if (sp && sp.length === 5) {
        return { context: sp[1].split('.')[0] };
      } else {
        return {};
      }
    } catch (error) {
      return {};
    }
  }
}
