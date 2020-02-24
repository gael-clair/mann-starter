import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { ApiQueryOptions } from './api-query.options';

/**
 * HTTP method.
 */
export enum Method {
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  JSONP = 'JSONP',
  OPTIONS = 'OPTIONS',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
}

/**
 * REST API operation.
 */
export enum ResourceOperation {
  CREATE,
  LIST,
  UPDATE,
  DELETE,
  GET,
  FIND_ONE,
  FIND,
}

/**
 * REST API resource request.
 */
export class ResourceRequest {
  /**
   * Possible parameters for each operation.
   */
  private readonly _optionsByOperation: Map<ResourceOperation, string[]> = new Map()
    .set(ResourceOperation.CREATE, [])
    .set(ResourceOperation.LIST, ['skip', 'sort', 'limit', 'select', 'populate'])
    .set(ResourceOperation.UPDATE, ['select', 'populate'])
    .set(ResourceOperation.DELETE, ['select', 'populate'])
    .set(ResourceOperation.GET, ['select', 'populate'])
    .set(ResourceOperation.FIND_ONE, ['select', 'populate'])
    .set(ResourceOperation.FIND, ['skip', 'sort', 'limit', 'select', 'populate']);

  /**
   * Default page size.
   */
  private readonly _DEFAULT_PAGE_SIZE = 20;

  /**
   * Associated HTTP request.
   */
  private httpRequest: HttpRequest<any>;

  /**
   * Returns an instance of ResourceRequest.
   * @param httpClient http client
   * @param operation API operation
   * @param url resource URL
   * @param body data to send
   * @param queryOptions request query parameters
   */
  constructor(
    private readonly httpClient: HttpClient,
    private readonly operation: ResourceOperation,
    url: string,
    body?: any,
    queryOptions?: ApiQueryOptions,
  ) {
    this.httpRequest = new HttpRequest(ResourceRequest.getMethodFromOperation(operation), url, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      }),
    });
    // Builds query parameters
    if (queryOptions) {
      if (queryOptions.sort) {
        this.sort(queryOptions.sort);
      }
      if (queryOptions.select) {
        this.select(queryOptions.select);
      }
      if (queryOptions.populate) {
        this.populate(queryOptions.populate);
      }
      if (queryOptions.skip) {
        this.skip(queryOptions.skip);
      }
      if (queryOptions.limit) {
        this.limit(queryOptions.limit);
      }
      if (queryOptions.page) {
        this.page(queryOptions.page.num, queryOptions.page.size);
      }
    }
  }
  /**
   * Returns HTTP method corresponding to a given operation.
   * @param operation operation
   */
  private static getMethodFromOperation(operation: ResourceOperation) {
    switch (operation) {
      case ResourceOperation.CREATE:
        return Method.POST;
      case ResourceOperation.LIST:
        return Method.GET;
      case ResourceOperation.UPDATE:
        return Method.PUT;
      case ResourceOperation.DELETE:
        return Method.DELETE;
      case ResourceOperation.GET:
        return Method.GET;
      case ResourceOperation.FIND_ONE:
        return Method.POST;
      case ResourceOperation.FIND:
        return Method.POST;
      default:
        throw new RangeError(`Operation '${operation}' is unsupported.`);
    }
  }

  /**
   * Adds a page query parameter to request.
   * @param num page number
   * @param size page size
   */
  page(num: number, size?: number): ResourceRequest {
    if (
      this._optionsByOperation.get(this.operation).indexOf('skip') > -1 &&
      this._optionsByOperation.get(this.operation).indexOf('limit') > -1
    ) {
      if (num < 0) {
        throw new RangeError('A page number could not be negative');
      }
      const pageSize = size || this._DEFAULT_PAGE_SIZE;
      if (pageSize < 1) {
        throw new RangeError('A page size should be positive');
      }
      const params: any = {
        limit: pageSize.toString(),
      };
      if (num > 1) {
        params.skip = (pageSize * num).toString();
      }
      this.httpRequest = this.httpRequest.clone({
        setParams: params,
      });
    }
    return this;
  }

  /**
   * Adds a skip query parameter to request.
   * @param size skip size
   */
  skip(size: number): ResourceRequest {
    if (this._optionsByOperation.get(this.operation).indexOf('skip') > -1) {
      if (size < 0) {
        throw new RangeError('Skip number could not be negative');
      }
      if (size > 1) {
        this.httpRequest = this.httpRequest.clone({
          setParams: {
            skip: size.toString(),
          },
        });
      }
    }
    return this;
  }

  /**
   * Adds a limit query parameter to request.
   * @param size limit size
   */
  limit(size: number): ResourceRequest {
    if (this._optionsByOperation.get(this.operation).indexOf('limit') > -1) {
      if (size < 0) {
        throw new RangeError('Limit number could not be negative');
      }
      if (size > 1) {
        this.httpRequest = this.httpRequest.clone({
          setParams: {
            limit: size.toString(),
          },
        });
      }
    }
    return this;
  }

  /**
   * Adds a sort query parameter to request.
   * @param sort sort order
   */
  sort(sort: string | object): ResourceRequest {
    if (this._optionsByOperation.get(this.operation).indexOf('sort') > -1) {
      this.httpRequest = this.httpRequest.clone({
        setParams: {
          sort: typeof sort === 'string' ? sort : JSON.stringify(sort),
        },
      });
    }
    return this;
  }

  /**
   * Adds a select query parameter to request.
   * @param select select value
   */
  select(select: string | object): ResourceRequest {
    if (this._optionsByOperation.get(this.operation).indexOf('select') > -1) {
      this.httpRequest = this.httpRequest.clone({
        setParams: {
          select: typeof select === 'string' ? select : JSON.stringify(select),
        },
      });
    }
    return this;
  }

  /**
   * Adds a populate query parameter to request.
   * @param populate populate value
   */
  populate(populate: string | object): ResourceRequest {
    if (this._optionsByOperation.get(this.operation).indexOf('populate') > -1) {
      this.httpRequest = this.httpRequest.clone({
        setParams: {
          populate: typeof populate === 'string' ? populate : JSON.stringify(populate),
        },
      });
    }
    return this;
  }

  /**
   * Executes request.
   */
  exec<T>() {
    return this.httpClient.request<T>(this.httpRequest).pipe(
      filter(event => event.type === HttpEventType.Response),
      map((response: HttpResponse<T>) => response.body),
    );
  }
}
