import { Schema } from 'mongoose';

/**
 * REST API resource. A resource represents a collection persisted in MongoDB and can be exposed or not through the REST API.
 */
export class Resource {
  /**
   * Build a REST API resource.
   * @param name model token (should be defined as a constant)
   * @param schema mongoose schema
   * @param path API resource path (mapped in controller)
   * @param privateFields Array of private fields (automatically removed when the resource is sent in API response)
   * @param exposed If true the resource is publicly exposed by the API
   * @param unique If true the resource is considered as unique (only one item is allowed in collection)
   */
  constructor(
    public readonly name: string,
    public readonly schema: Schema,
    public readonly path: string,
    public readonly privateFields?: string[],
    public readonly exposed?: boolean,
    public readonly unique?: boolean,
  ) {}
}
