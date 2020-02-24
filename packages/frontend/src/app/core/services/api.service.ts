import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiQueryOptions, ResourceItem, ResourceOperation, ResourceRequest } from '../models';

/**
 * REST API resource service.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /**
   * Returns an instance of ApiService.
   * @param http http client
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Returns full API resource URL.
   * @param resource resource path
   */
  private getResource(resource: string) {
    return `/resources/${resource}`;
  }

  /**
   * Returns a request to create a new resource item.
   * @param resource resource path
   * @param item item to create
   */
  create<T extends ResourceItem>(resource: string, item: Partial<T>) {
    return new ResourceRequest(this.http, ResourceOperation.CREATE, this.getResource(resource), item);
  }

  /**
   * Returns a request to update a resource item with given id.
   * @param resource resource path
   * @param id item id to update
   * @param item item to create
   * @param queryOptions request query parameters
   */
  update<T extends ResourceItem>(resource: string, id: string, item: Partial<T>, queryOptions?: ApiQueryOptions) {
    return new ResourceRequest(
      this.http,
      ResourceOperation.UPDATE,
      `${this.getResource(resource)}/${id}`,
      item,
      queryOptions,
    );
  }

  /**
   * Returns a request to list resource items.
   * @param resource resource path
   * @param queryOptions request query parameters
   */
  list(resource: string, queryOptions?: ApiQueryOptions) {
    return new ResourceRequest(this.http, ResourceOperation.LIST, this.getResource(resource), undefined, queryOptions);
  }

  /**
   * Returns a request to delete a resource item with its id.
   * @param resource resource path
   * @param id item id to delete
   * @param queryOptions request query parameters
   */
  delete(resource: string, id: string, queryOptions?: ApiQueryOptions) {
    return new ResourceRequest(
      this.http,
      ResourceOperation.DELETE,
      `${this.getResource(resource)}/${id}`,
      undefined,
      queryOptions,
    );
  }

  /**
   * Returns a request to get a resource item with its id.
   * @param resource resource path
   * @param id item id to get
   * @param queryOptions request query parameters
   */
  get(resource: string, id: string, queryOptions?: ApiQueryOptions) {
    return new ResourceRequest(
      this.http,
      ResourceOperation.GET,
      `${this.getResource(resource)}/${id}`,
      undefined,
      queryOptions,
    );
  }

  /**
   * Returns a request to search for one resource item corresponding to given criteria.
   * @param resource resource path
   * @param cond search criteria
   * @param queryOptions request query parameters
   */
  findOne(resource: string, cond: object, queryOptions?: ApiQueryOptions) {
    return new ResourceRequest(
      this.http,
      ResourceOperation.FIND_ONE,
      `${this.getResource(resource)}/find`,
      cond,
      queryOptions,
    );
  }

  /**
   * Returns a request to search for resource items corresponding to given criteria.
   * @param resource resource path
   * @param cond search criteria
   * @param queryOptions request query parameters
   */
  find(resource: string, cond: object, queryOptions?: ApiQueryOptions) {
    return new ResourceRequest(
      this.http,
      ResourceOperation.FIND,
      `${this.getResource(resource)}/search`,
      cond,
      queryOptions,
    );
  }
}
