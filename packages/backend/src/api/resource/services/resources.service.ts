import { Document } from 'mongoose';

import { NotFoundException } from '@app/core/models';

import { Repository } from '../models';

/**
 * Meta-service of resource services.
 */
export class ResourcesService<D extends Document, T extends Repository<D>> {
  constructor(public readonly services: T[]) {}

  /**
   * Returns an array of all resources path
   */
  public getResourcesPath(): string[] {
    return this.services.map(service => service.getResource().path);
  }

  /**
   * Returns the service associated to the given resource path.
   * @param path resource path
   * @param exposed if true returns a service only if associated resource is exposed
   * @throws NotFoundException if no service is found or if resource associated to the found service is not exposed
   */
  public getResourceServiceByResourcePath(path: string, exposed = true): T {
    const service = this.services.find(srv => srv.getResource().path === path);
    if (!service) {
      throw new NotFoundException(`No service found for resource path '${path}'`);
    }
    if (service.getResource().exposed === false && exposed) {
      throw new NotFoundException(`Resource with resource path '${path}' is not exposed`);
    }
    return service;
  }

  /**
   * Returns the service associated to the given resource name.
   * @param name resource name
   * @param exposed if true returns a service only if associated resource is exposed
   * @throws NotFoundException if no service is found or if resource associated to the found service is not exposed
   */
  public getResourceServiceByResourceName(name: string, exposed = true): T {
    const service = this.services.find(srv => srv.getResource().name === name);
    if (!service) {
      throw new NotFoundException(`No service found for resource name '${name}'`);
    }
    if (service.getResource().exposed === false && exposed) {
      throw new NotFoundException(`Resource with resource name '${name}' is not exposed`);
    }
    return service;
  }
}
