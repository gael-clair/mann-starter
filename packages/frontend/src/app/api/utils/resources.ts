import { Provider } from '@angular/core';
import { AppError, Resource, ResourceItem } from '@app/core/models';
import { ApiService } from '@app/core/services';

import { RESOURCE_SERVICES } from '../constants';
import { ResourceService } from '../services';

/**
 * Validates resource configuration and returns resource services providers. If several resources has same name or path throws an AppError.
 * @param resources resources
 */
export function validateResourcesAndGetProviders(resources: Resource[]) {
  const nameSeen = [];
  const pathSeen = [];
  const resourcesProvider: Provider[] = [];
  resources.forEach(resource => {
    if (nameSeen.includes(resource.name)) {
      throw new AppError(`Multiple resources with same name: ${resource.name}`);
    } else {
      nameSeen.push(resource.name);
    }
    if (pathSeen.includes(resource.apiPath)) {
      throw new AppError(`Multiple resources with same path: ${resource.apiPath}`);
    } else {
      pathSeen.push(resource.apiPath);
    }
    // Creates resource service provider for current resource
    resourcesProvider.push({
      provide: RESOURCE_SERVICES,
      useFactory: (apiService: ApiService) => new ResourceService(resource, apiService),
      deps: [ApiService],
      multi: true,
    });
  });
  return resourcesProvider;
}

/**
 * Returns resource service of a given resource.
 * @param resourceServices array of resource services
 * @param resource resource
 */
export function getServiceFromResource<T extends ResourceItem>(
  resourceServices: ResourceService<ResourceItem>[],
  resource: Resource,
) {
  const service = resourceServices.find(srv => srv.resource.name === resource.name);
  if (!service) {
    throw new AppError(`No resource service found for resource '${resource.name}'`);
  }
  return service as ResourceService<T>;
}
