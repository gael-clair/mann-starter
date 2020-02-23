import { Body, Controller, Get, Post } from '@nestjs/common';

import { SampleDto } from './dtos';

/**
 * REST API main controller
 */
@Controller()
export class ApiController {
  /**
   * Answers to a ping request (to check status).
   */
  @Get('ping')
  public ping(): object {
    return { pong: 'OK' };
  }

  /**
   * Example of an endpoint with input validation.
   * @param sampleDto DTO to validate
   */
  @Post('validation')
  public validation(@Body() sampleDto: SampleDto): SampleDto {
    return sampleDto;
  }
}
