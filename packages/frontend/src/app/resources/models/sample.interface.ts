import { Resource, ResourceItem } from '@app/core/models';

/**
 * Sample resource interface.
 */
export interface Sample extends ResourceItem {
  /**
   * Name.
   */
  name: string;
}

/**
 * Sample resource.
 */
export const SAMPLE_RESOURCE = new Resource('samples', 'samples');
