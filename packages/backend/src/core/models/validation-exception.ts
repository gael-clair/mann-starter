import { BadRequestException } from '@nestjs/common';

/**
 * Error thrown when an API input parameter validation (query or param) fails.
 */
export class ValidationException extends BadRequestException {
  constructor(message: any) {
    super(message, 'VALIDATION_ERROR');
  }
}
