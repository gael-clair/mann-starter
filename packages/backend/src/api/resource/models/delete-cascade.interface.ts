import { Model } from 'mongoose';

/**
 * Cascade deletes one item of a resource.
 * Item model should implements this interface with operations to perform when an item is deleted.
 */
export interface DeleteCascade {
  /**
   * Cascade deletes related items in collections when item is deleted.
   * @param model item model
   */
  deleteCascade(model?: Model<any>): Promise<any>;
}
