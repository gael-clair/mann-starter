import { Schema } from 'mongoose';

/**
 * Mongoose model for feature module.
 */
export interface Model {
  /**
   * Name.
   */
  name: string;

  /**
   * Mongoose schema.
   */
  schema: Schema;
}
