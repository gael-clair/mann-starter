import { blue, green, grey, red, yellow } from 'colors/safe';
import { existsSync, mkdirSync } from 'fs-extra';
import * as moment from 'moment';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

import { LOG_FOLDER, LOG_LEVEL, LOG_RETENTION, LOG_ROTATION_SIZE, NODE_ENV } from '@app/core/config/constants';
import { getStringFromEnv } from '@app/core/config/utils';

import { DEFAULT_LOGGER_ID } from '../constants';
import { NestLikeLoggerService } from '../services';

const loggers: Set<string> = new Set();

/*
 * Converts a string from camel case to a separated string.
 * @param text string to convert
 * @param separator separator to use
 */
function decamelize(text: string, separator = '_'): string {
  return text
    .replace(/([\p{Lowercase_Letter}\d])(\p{Uppercase_Letter})/gu, `$1${separator}$2`)
    .replace(/(\p{Uppercase_Letter}+)(\p{Uppercase_Letter}\p{Lowercase_Letter}+)/gu, `$1${separator}$2`)
    .toLowerCase();
}

/**
 * Returns a file transport with file rotation enabled.
 */
function getFileTransport(name: string): DailyRotateFile {
  const dailyRotateFileTransportOptions: DailyRotateFile.DailyRotateFileTransportOptions = {
    datePattern: 'YYYY.MM.DD',
    dirname: getStringFromEnv(LOG_FOLDER),
    filename: `${decamelize(name)}-%DATE%.log`,
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    level: getStringFromEnv(LOG_LEVEL),
    maxFiles: getStringFromEnv(LOG_RETENTION),
    maxSize: getStringFromEnv(LOG_ROTATION_SIZE),
    silent: getStringFromEnv(LOG_LEVEL) === 'silent',
    zippedArchive: true,
    json: true,
    //name: DAILYROTATEFILE_TRANSPORT_NAME, // TODO Check if needed
  };
  return new DailyRotateFile(dailyRotateFileTransportOptions);
}

/**
 * Returns a log formatted log message with colors.
 * @param param entry to log
 */
/* istanbul ignore next */
function formatLog({ context, level, timestamp, message, ...meta }: any): string {
  const ts = typeof timestamp !== 'undefined' ? green(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] `) : ' ';
  let lvl: string;
  const lvlUC = level.toUpperCase();
  switch (lvlUC) {
    case 'INFO':
      lvl = blue(`[${lvlUC}]`.padEnd(12 - 2));
      break;
    case 'ERROR':
      lvl = red(`[${lvlUC}]`.padEnd(12 - 2));
      break;
    case 'WARN':
      lvl = yellow(`[${lvlUC}]`.padEnd(12 - 2));
      break;
    case 'VERBOSE':
      lvl = grey(`[${lvlUC}]`.padEnd(12 - 2));
      break;
    case 'DEBUG':
      lvl = `[${lvlUC}]`.padEnd(12 - 2);
      break;
    default:
      lvl = `[${lvlUC}]`.padEnd(12 - 2);
      break;
  }
  const ctx = typeof context !== 'undefined' ? yellow(`[${context}]`.padEnd(25 - 2)) : '';
  const msg = message;
  const mta = JSON.stringify(meta) !== '{}' ? `\n${''.padStart(53, ' ')}${JSON.stringify(meta)}` : '';
  return `${ts}${lvl}${ctx}${msg}${mta}`;
}

/**
 * Returns a console transport with color and message formatting.
 */
function getConsoleTransport(): winston.transports.ConsoleTransportInstance {
  const consoleTransportOptions: winston.transports.ConsoleTransportOptions = {
    format: winston.format.printf(formatLog),
    level: 'debug',
  };
  return new winston.transports.Console(consoleTransportOptions);
}

/**
 * Returns an array of transports for a logger. Transports are evaluated in function of running environment.
 * @param logger logger name
 */
function createTransports(logger: string): winston.transports.StreamTransportInstance[] {
  const loggerTransports = [];
  // Gets running environment
  const env = getStringFromEnv(NODE_ENV);
  if (env !== 'test') {
    // If not in test, adds file transport
    loggerTransports.push(getFileTransport(logger));
  }
  if (env === 'development') {
    // If in development, adds console transport
    loggerTransports.push(getConsoleTransport());
  }
  return loggerTransports;
}

/**
 * Returns a logger by its name. If it does not exist, a new logger is created.
 * @param name logger name
 */
export function createLogger(name: string): winston.Logger {
  if (!existsSync(getStringFromEnv(LOG_FOLDER))) {
    // Logging folder does not exist, it is created
    mkdirSync(getStringFromEnv(LOG_FOLDER));
  }

  const nameLC = name.toLowerCase();
  if (!winston.loggers.has(nameLC)) {
    // No logger with this name found, it is created and returned
    const transportsList = createTransports(name);
    return winston.loggers.add(nameLC, {
      format: winston.format.combine(winston.format.splat(), winston.format.timestamp(), winston.format.json()),
      transports: [...transportsList],
      exceptionHandlers: [...transportsList],
      exitOnError: false,
    });
  } else {
    // Logger with tis name exists, return it
    return winston.loggers.get(nameLC);
  }
}

/**
 * Returns an application logger service encapsulated in a Nestjs like logger service.
 * If name is not provided, default logger name is used.
 * @param name logger name
 */
export function getNestjsLogger(name: string = DEFAULT_LOGGER_ID): NestLikeLoggerService {
  return new NestLikeLoggerService(createLogger(name));
}

/**
 * Returns a logger by its name.
 * @param name logger name
 */
export function getLoggerByName(name: string): winston.Logger {
  return winston.loggers.get(name.toLowerCase());
}

/**
 * Returns an array of existing loggers name.
 */
export function getLoggers(): string[] {
  return Array.from(loggers);
}

/**
 * Adds multiple loggers by their names.
 * @param names loggers name list
 */
export function addLoggers(names: string[]): void {
  names.forEach(name => loggers.add(name.toLowerCase()));
}

/**
 * Adds a new logger from a name.
 * @param name logger name
 */
export function addLogger(name: string): void {
  loggers.add(name.toLowerCase());
}
