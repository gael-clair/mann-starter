import { NotFoundException as NestjsNotFoundException } from '@nestjs/common';

/**
 * Error thrown when a resource could not be found.
 */
export class NotFoundException extends NestjsNotFoundException {
  constructor(message: any) {
    super(message, 'NOT_FOUND_ERROR');
  }
}
