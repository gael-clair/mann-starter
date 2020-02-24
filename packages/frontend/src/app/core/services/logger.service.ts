import { Injectable } from '@angular/core';

import { LogLevel } from '../models';

import { ConfigurationService } from './configuration.service';

/**
 * Log function doing nothing (used when log level is lower than current minimal level)
 */
const noLog = () => undefined;

/**
 * Application logger.
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  /**
   * Current minimal log level.
   */
  private level: string;

  /**
   * Returns an instance of LoggerService.
   * @param configurationService configuration service
   */
  constructor(private readonly configurationService: ConfigurationService) {
    this.configurationService.configuration.subscribe(configuration => (this.level = configuration.logLevel));
  }

  /**
   * Logs a message at debug level.
   */
  get debug() {
    return LogLevel.DEBUG <= LogLevel[this.level] ? console.log.bind(console, '[DEBUG]') : noLog;
  }

  /**
   * Logs a message at info level.
   */
  get info() {
    return LogLevel.INFO <= LogLevel[this.level] ? console.log.bind(console, '[INFO]') : noLog;
  }

  /**
   * Logs a message at warn level.
   */
  get warn() {
    return LogLevel.WARN <= LogLevel[this.level] ? console.log.bind(console, '[WARN]') : noLog;
  }

  /**
   * Logs a message at error level.
   */
  get error() {
    return LogLevel.ERROR <= LogLevel[this.level] ? console.error.bind(console, '[ERROR]') : noLog;
  }
}
