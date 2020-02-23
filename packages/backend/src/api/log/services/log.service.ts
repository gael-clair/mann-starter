import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryOptions } from 'winston';

import { DAILYROTATEFILE_TRANSPORT_NAME } from '@app/logger/constants';
import { LoggerService } from '@app/logger/services';
import { getLoggerByName, getLoggers } from '@app/logger/utils';

import { LogLogger } from '../decorators';
import { LogParamDto, LogQueryDto } from '../dtos';

/**
 * Service to query logs.
 */
@Injectable()
export class LogService {
  /**
   * Default number of line to read.
   */
  private static readonly _DEFAULT_LAST_LINES_COUNT = 100;

  constructor(@LogLogger() private readonly logger: LoggerService) {}

  /**
   * Returns an array of existing loggers name.
   */
  public getSubLoggers(): string[] {
    return getLoggers();
  }

  /**
   * Returns log lines corresponding to given criteria.
   * @param logParamDto search criteria
   */
  public async getAppLog(logParamDto: LogParamDto, logQueryDto?: LogQueryDto): Promise<any> {
    return new Promise((resolve, reject) => {
      // Search options
      let options: QueryOptions = {
        limit: logParamDto.lines || LogService._DEFAULT_LAST_LINES_COUNT,
        fields: undefined,
        order: 'asc',
      };
      if (logQueryDto) {
        // Merges search options with options sent in the request
        options = Object.assign(options, logQueryDto);
      }
      // Selects logger
      const logger = getLoggerByName(logParamDto.sub);
      if (!logger) {
        throw new NotFoundException(`Logger with name '${logParamDto.sub}' not found`);
      }
      // Queries log
      logger.query(options, (err: Error, lines: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(lines[DAILYROTATEFILE_TRANSPORT_NAME]);
        }
      });
    });
  }
}
