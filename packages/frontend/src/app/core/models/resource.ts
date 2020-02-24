/**
 * REST API resource.
 */
export class Resource {
  /**
   * Returns an instance of Resource.
   * @param name resource name
   * @param apiPath API path
   * @param cacheable if true resource could be cached
   */
  constructor(public readonly name: string, public readonly apiPath: string, public readonly cacheable = true) {}
}
