import { Controller, Get, Param, Query } from '@nestjs/common';

import { DEFAULT_LOGGER_ID } from '@app/logger/constants';

import { LogParamDto, LogQueryDto } from '../dtos';
import { LogService } from '../services';

/**
 * REST API controller for log endpoints.
 */
@Controller()
export class LogController {
  constructor(private readonly logService: LogService) {}

  /**
   * Returns an array of existing loggers name.
   */
  @Get('list')
  public getSubLoggers(): string[] {
    return this.logService.getSubLoggers();
  }

  /**
   * Returns last global logger log lines corresponding to given criteria.
   * @param logQueryDto search query criteria
   */
  @Get()
  public async getGlobalAppLog(@Query() logQueryDto: LogQueryDto): Promise<any> {
    return this.logService.getAppLog({ sub: DEFAULT_LOGGER_ID }, logQueryDto);
  }

  /**
   * Returns last given number of global logger log lines corresponding to given criteria.
   * @param logParamDto path parameters for log query
   * @param logQueryDto search query criteria
   */
  @Get(':lines')
  public async getGlobalAppLogNbLines(
    @Param() logParamDto: LogParamDto,
    @Query() logQueryDto: LogQueryDto,
  ): Promise<any> {
    logParamDto.sub = DEFAULT_LOGGER_ID;
    return this.logService.getAppLog(logParamDto, logQueryDto);
  }

  /**
   * Returns last given number of a given logger log lines corresponding to given criteria.
   * @param logParamDto path parameters for log query
   * @param logQueryDto search query criteria
   */
  @Get('sub/:sub/:lines')
  public async getAppLogNbLines(@Param() logParamDto: LogParamDto, @Query() logQueryDto: LogQueryDto): Promise<any> {
    return this.logService.getAppLog(logParamDto, logQueryDto);
  }

  /**
   * Returns last log lines of a given logger corresponding to given criteria.
   * @param logParamDto path parameters for log query
   * @param logQueryDto search query criteria
   */
  @Get('sub/:sub')
  public async getAppLog(@Param() logParamDto: LogParamDto, @Query() logQueryDto: LogQueryDto): Promise<any> {
    return this.logService.getAppLog(logParamDto, logQueryDto);
  }
}
