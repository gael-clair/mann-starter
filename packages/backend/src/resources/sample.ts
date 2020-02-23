import { Document, Schema } from 'mongoose';

import { Resource } from '@app/api/resource/models';

/**
 * Sample resource interface.
 */
export interface Sample extends Document {
  /**
   * Name.
   */
  name: string;
}

/**
 * Sample resource Mongoose schema.
 */
export const SampleSchema: Schema<Sample> = new Schema({
  name: {
    type: String,
  },
});

/**
 * Sample resource declaration.
 */
export const SAMPLE_RESOURCE = new Resource('Samples', SampleSchema, 'samples');
