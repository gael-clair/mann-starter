# How to add a new resource (model)

## Resource class

```typescript
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
```

## Resource creation

To add a new resource, or mongoose model, you have to:

-   Create a new file for resource `src/resources/name_of_resource.ts`
-   Create resource interface extending Mongoose Document in resource file

```typescript
/**
 * Sample resource interface.
 */
export interface Sample extends Document {
  /**
   * Name.
   */
  name: string;
}
```

-   Create Mongoose schema in resource file

```typescript
/**
 * Sample resource Mongoose schema.
 */
export const SampleSchema: Schema<Sample> = new Schema({
  name: {
    type: String,
  },
});
```

-   Create a new Resource using [resource class](#resource-class) constructor in resource file

```typescript
export const RESOURCE = new Resource('Samples', SampleSchema, 'samples');
```

-   Add export of resource in `src/resources/index.ts` file (to let the new resource be handled by resource module)

```typescript
import { RESOURCE } from './name_of_resource';

export { RESOURCE };
```
