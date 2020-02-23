import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

/**
 * Global exception filter.
 * @see https://docs.nestjs.com/exception-filters
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  /**
   * Handles an uncatched exception and convert it to an API response with corresponding JSON and status.
   * @param exception exception to handle
   * @param host current context
   */
  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: any;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      body = exception.getResponse();
    } else {
      body = HttpException.createBody(
        exception instanceof Error ? exception.message : (exception as any),
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    response.status(status).json(body);
  }
}
