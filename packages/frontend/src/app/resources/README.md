# How to add a new REST resource

## Resource Item interface

```typescript
/**
 * REST resource item.
 */
interface ResourceItem {
  /**
   * ID.
   */
  _id: string;
}
```

## Resource class

```typescript
/**
 * REST API resource.
 */
class Resource<T extends ResourceItem> {
  /**
   * Returns a REST API resource.
   * @param name resource name
   * @param apiPath API path
   * @param cacheable if true resource could be cached
   */
  constructor(public readonly name: string, public readonly apiPath: string, public readonly cacheable = true) {}
}
```

## Resource creation

To add a new resource, or mongoose model, you have to:

1.  Create a new file for resource `src/resources/models/resource_name.ts`

2.  Create and export resource interface extending [ResourceItem](#resource-item-interface) interface:

```typescript
/**
 * Sample.
 */
export interface Sample extends ResourceItem {
  /**
   * Nom.
   */
  name: string;
}
```

3.  Create and export resource using [Resource](#resource-class) class:

```typescript
export const SAMPLE_RESOURCE = new Resource('samples', 'samples');
```

1.  Add export of resource in `src/resources/models/index.ts`:

```typescript
export * from './resource_name';
```

5.  Add export of new resource in `src/resources/index.ts`:

```typescript
import { RESOURCE } from './resource_name';

export { RESOURCE };
```
