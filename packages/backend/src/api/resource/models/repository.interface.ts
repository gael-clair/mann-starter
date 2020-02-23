import { Document } from 'mongoose';

import { Resource } from './resource';

/**
 * Service handling access to a resource collection in database.
 */
export interface Repository<T extends Document> {
  /**
   * Returns resource associated to this service.
   */
  getResource(): Resource;

  /**
   * Creates a new item in collection and returns created item.
   * @param item item to create
   */
  create(item: any): Promise<T>;

  /**
   * Updates an item by its id and returns updated item.
   * @param id id of item to update
   * @param item updates to apply
   * @param returnNew if true, the updated item is returned
   * @param params request parameters to build query
   */
  update(id: string, item: any, returnNew: boolean, params?: any): Promise<T | null>;

  /**
   * Deletes an item by its id and returns it.
   * @param id id of item to delete
   * @param params request parameters to build query
   */
  delete(id: string, params?: any): Promise<T | null>;

  /**
   * Returns collection items.
   * @param params request parameters to build query
   */
  list(params?: any): Promise<T[]>;

  /**
   * Returns one item by its id.
   * @param id id of item
   * @param params request parameters to build query
   */
  findById(id: string, params?: any): Promise<T | null>;

  /**
   * Searches and returns on item corresponding to given search criteria.
   * @param cond search criteria
   * @param params request parameters to build query
   */
  findOne(cond: object, params?: any): Promise<T | null>;

  /**
   * Searches and returns items corresponding to given search criteria.
   * Retourne une promesse résolue avec la liste des éléments trouvés.
   * @param cond search criteria
   * @param params request parameters to build query
   */
  find(cond: object, params?: any): Promise<T[]>;
}
