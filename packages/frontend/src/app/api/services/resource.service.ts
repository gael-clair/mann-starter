import { Injectable } from '@angular/core';
import { ApiQueryOptions, AppError, Resource, ResourceItem } from '@app/core/models';
import { ApiService } from '@app/core/services';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

/**
 * Resource service.
 */
@Injectable({
  providedIn: 'root',
})
export class ResourceService<T extends ResourceItem> {
  /**
   * Returns an instance of ResourceService associated to given resource.
   * @param resource resource
   * @param apiService REST API service
   */
  constructor(public readonly resource: Resource, private readonly apiService: ApiService) {}

  /**
   * Resource items.
   */
  private readonly items$ = new BehaviorSubject<Map<string, T>>(new Map());

  /**
   * Returns an observable on resource items map.
   */
  getItemsAsMap() {
    return this.items$.asObservable();
  }

  /**
   * Returns an observable on resource items list.
   */
  getItems() {
    return this.items$.asObservable().pipe(map(items => [...items.values()]));
  }

  /**
   * Returns a promise on created resource item.
   * @param item item to create
   */
  create(item: Partial<T>) {
    return this.apiService
      .create(this.resource.name, item)
      .exec<T>()
      .pipe(
        tap(created => this.items$.next(new Map(this.items$.getValue().set(created._id, created)))),
        catchError(error =>
          throwError(new AppError(`Error during resource item creation on '${this.resource.apiPath}'`, error)),
        ),
      )
      .toPromise();
  }

  /**
   * Returns a promise on updated resource item. If cache is used, only cache is updated and no request is sent.
   * @param id item id to update
   * @param updates updates of item
   * @param queryOptions query parameters
   */
  update(id: string, updates: Partial<T>, queryOptions?: ApiQueryOptions) {
    if (queryOptions && queryOptions.cache && this.resource.cacheable) {
      // Uses cache
      const updated = Object.assign(this.items$.getValue().get(id), updates);
      this.items$.next(new Map(this.items$.getValue().set(id, updated)));
      return Promise.resolve(updated);
    } else {
      return this.apiService
        .update(this.resource.name, id, updates, queryOptions)
        .exec<T>()
        .pipe(
          tap(updated => this.items$.next(new Map(this.items$.getValue().set(updated._id, updated)))),
          catchError(error =>
            throwError(new AppError(`Error during resource item '${id}' update on '${this.resource.apiPath}'`, error)),
          ),
        )
        .toPromise();
    }
  }

  /**
   * Returns a promise on resource items list. If cache is used, items are listed from cache and no request is sent.
   * @param queryOptions query parameters
   */
  list(queryOptions?: ApiQueryOptions) {
    if (queryOptions && queryOptions.cache && this.resource.cacheable) {
      // Uses cache
      return Promise.resolve([...this.items$.getValue().values()]);
    } else {
      return this.apiService
        .list(this.resource.name, queryOptions)
        .exec<T[]>()
        .pipe(
          tap(items => {
            const newItems = new Map();
            items.forEach(item => newItems.set(item._id, item));
            this.items$.next(newItems);
          }),
          catchError(error =>
            throwError(new AppError(`Error during resource items listing on '${this.resource.apiPath}'`, error)),
          ),
        )
        .toPromise();
    }
  }

  /**
   * Returns a promise on resource deleted item. If cache is used, item is deleted from cache and no request is sent.
   * @param id item id to delete
   * @param queryOptions query parameters
   */
  delete(id: string, queryOptions?: ApiQueryOptions) {
    if (queryOptions && queryOptions.cache && this.resource.cacheable) {
      // Uses cache
      return Promise.resolve(this.deleteIfExists(id));
    } else {
      return this.apiService
        .delete(this.resource.name, id, queryOptions)
        .exec<T>()
        .pipe(
          tap(deleted => this.deleteIfExists(deleted._id)),
          catchError(error =>
            throwError(
              new AppError(`Error during resource item '${id}' deletion on '${this.resource.apiPath}'`, error),
            ),
          ),
        )
        .toPromise();
    }
  }

  /**
   * Returns a promise on resource item. If cache is used, item is read from cache and no request is sent.
   * @param id item id to read
   * @param queryOptions query parameters
   */
  get(id: string, queryOptions?: ApiQueryOptions) {
    if (queryOptions && queryOptions.cache && this.resource.cacheable) {
      // Uses cache
      return Promise.resolve(this.items$.getValue().get(id));
    } else {
      return this.apiService
        .get(this.resource.name, id, queryOptions)
        .exec<T>()
        .pipe(
          tap(item => this.items$.next(new Map(this.items$.getValue().set(item._id, item)))),
          catchError(error =>
            throwError(new AppError(`Error during resource item '${id}' reading on '${this.resource.apiPath}'`, error)),
          ),
        )
        .toPromise();
    }
  }

  /**
   * Returns a promise on a resource item corresponding to search criteria. Cache is never used for this operation.
   * @param cond search criteria
   * @param queryOptions query parameters
   */
  findOne(cond: object, queryOptions?: ApiQueryOptions) {
    return this.apiService
      .findOne(this.resource.name, cond, queryOptions)
      .exec<T>()
      .toPromise();
  }

  /**
   * Returns a promise on resource items corresponding to search criteria. Cache is never used for this operation.
   * @param cond search criteria
   * @param queryOptions query parameters
   */
  find(cond: object, queryOptions?: ApiQueryOptions) {
    return this.apiService
      .find(this.resource.name, cond, queryOptions)
      .exec<T[]>()
      .toPromise();
  }

  /**
   * Checks if an item exists in local cache. If true item is removed from cache and returned.
   * @param id item id to delete
   */
  private deleteIfExists(id: string) {
    const items = this.items$.getValue();
    const deletedItem = items.get(id);
    if (deletedItem) {
      items.delete(deletedItem._id);
      this.items$.next(new Map(items));
    }
    return deletedItem;
  }
}
