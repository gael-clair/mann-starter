import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Document } from 'mongoose';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoggerService } from '@app/logger/services';

import { DEFAULT_PRIVATE_PROPERTIES, RESOURCES_SERVICES } from '../constants';
import { ResourceLogger } from '../decorators';
import { Repository } from '../models';
import { ResourcesService } from '../services';

/**
 * Interceptor to filter fields that are defined as private and should not be returned in REST API results.
 */
@Injectable()
export class FieldsFilterInterceptor<D extends Document, T extends Repository<D>> implements NestInterceptor {
  constructor(
    @ResourceLogger() private readonly logger: LoggerService,
    @Inject(RESOURCES_SERVICES) private readonly resourcesService: ResourcesService<D, T>,
  ) {}

  /**
   * Intercept and returns a request after removing of private fields.
   * @param context request context
   * @param next next request handler
   */
  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    // Builds private fields array
    const privateFields = this.getPrivateFields(request);
    if (privateFields.length > 0) {
      // Filters fields
      this.logger.info(`Filtering private fields '${privateFields}' of resource ${request.params.resource}`);
      return next.handle().pipe(map(data => this.filter(data, privateFields)));
    } else {
      return next.handle();
    }
  }

  /**
   * Returns an array of private fields of requested resource (default fields + resource fields).
   * @param request request
   */
  private getPrivateFields(request: Request): string[] {
    let privateFields = DEFAULT_PRIVATE_PROPERTIES || [];
    try {
      const resource = this.resourcesService.getResourceServiceByResourcePath(request.params.resource).getResource();
      if (resource && resource.privateFields) {
        // Resource has private fields, concatenates them with default private fields
        privateFields = [...new Set([...privateFields, ...resource.privateFields])];
      }
      this.logger.debug(`Private fields of '${resource.name}' to filter`);
      return privateFields;
    } catch (error) {
      // If no resource found, no filter is apply
      return [];
    }
  }

  /**
   * Returns one or array of items after private fields filtering.
   * @param data data to filter
   * @param privateFields array of private fields to remove
   */
  private filter(data: any, privateFields: string[]): any {
    let result = data;
    if (privateFields.length > 0) {
      // If data is an array of items, filters fields of each items
      result = Array.isArray(data)
        ? data.map(item => this.removePrivateField(item, privateFields))
        : this.removePrivateField(data, privateFields);
    }
    return result;
  }

  /**
   * Returns one item after private fields filtering.
   * @param item item to filter
   * @param privateFields array of private fields to remove
   */
  private removePrivateField(item: any, privateFields: string[]): any {
    let filtered = item;
    if (typeof item.toObject === 'function') filtered = item.toObject();
    privateFields.forEach(field => {
      delete filtered[field];
      this.logger.debug(`Field '${field}' removed`);
    });
    return filtered;
  }
}
