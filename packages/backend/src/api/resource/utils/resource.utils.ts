import * as resources from '@app/resources';

import { Resource, Model } from '../models';

/**
 * Returns an array of models for Mongoose feature module from resources.
 */
export function getModels(): Model[] {
  const models: any[] = [];
  Object.values(resources).forEach((resource: Resource) => {
    models.push({ name: resource.name, schema: resource.schema });
  });
  return models;
}

/**
 * Returns injection token name for a resource service.
 * @param resource associated resource to service
 */
export function getProviderToken(resource: Resource): string {
  return `${resource.name.toUpperCase()}_SERVICE`;
}

/**
 * Returns an array of injection tokens name for all resource services.
 */
export function getResourceProviderTokens(): string[] {
  const tokens: string[] = [];
  Object.values(resources).forEach((resource: Resource) => {
    tokens.push(getProviderToken(resource));
  });
  return tokens;
}

/**
 * Checks if a string is a valid Mongoose ObjectId.
 * Returns true, if id is valid.
 * @param id id to check
 */
export function isValidObjectId(id: string): boolean {
  return id && /^[0-9a-fA-F]{24}$/.test(id);
}
