import { Model } from 'mongoose';

/**
 * Cascade creates one item of a resource.
 * Item model should implements this interface with operations to perform when an item is created.
 */
export interface CreateCascade {
  /**
   * Cascade creates related items in collections when item is created.
   * @param model item model
   */
  createCascade(model?: Model<any>): Promise<any>;
}
