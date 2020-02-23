// tslint:disable:max-file-line-count

import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Document, Model, Query } from 'mongoose';

import { LoggerService } from '@app/logger/services';

import { CreateCascade, DeleteCascade, Repository, Resource, ResourceQuery } from '../models';
import { isValidObjectId } from '../utils';

/**
 * @see Repository
 */
export class RepositoryService<T extends Document> implements Repository<T> {
  /**
   * Possible parameters for each operation (populate must always be after select)
   */
  private readonly optionsByOperation: Map<string, string[]> = new Map()
    .set('list', ['skip', 'sort', 'limit', 'select', 'populate'])
    .set('update', ['select', 'populate'])
    .set('delete', ['select', 'populate'])
    .set('findById', ['select', 'populate'])
    .set('findOne', ['select', 'populate'])
    .set('find', ['skip', 'sort', 'limit', 'select', 'populate']);

  /**
   * Returns a new service for given resource and model.
   * @param logger logger service
   * @param model associated Mongoose model
   * @param resource associated resource
   */
  constructor(
    private readonly logger: LoggerService,
    private readonly model: Model<T>,
    private readonly resource: Resource,
  ) {}

  /**
   * Tries to parse a JSON value. Returns, if parsing fails, the value unchanged, otherwise parsed object.
   * @param value value to parse
   */
  private static parseStringOrJSON(value: any): any {
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }

  /**
   * Tries to parse a number value. Returns, if parsing fails, undefined, otherwise a number from the value.
   * @param value value to parse
   */
  private static parseNumber(value: any): number | undefined {
    const val = parseInt(value, 10);
    if (!isNaN(val) && val > 0) return val;
    return undefined;
  }

  /**
   * @see Repository.getResource
   */
  public getResource(): Resource {
    return this.resource;
  }

  /**
   * @see Repository.create
   */
  public async create(item: T): Promise<T> {
    if (this.resource.unique) {
      // Checks uniqueness
      if ((await this.model.estimatedDocumentCount().exec()) !== 0) {
        throw new ConflictException('Resource is unique and one item already exists');
      }
    }
    // Creates item
    const created: any = await this.model.create(item);
    if ((created as CreateCascade).createCascade) {
      // Cascade delete if needed by resource
      await created.createCascade(this.model);
    }
    return created;
  }

  /**
   * @see Repository.update
   */
  public async update(id: string, item: T, returnNew = true, params?: ResourceQuery): Promise<T> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`'${id}' is not a valid ObjectId`);
    }
    // Builds and executes query
    const result = await this.buildQuery(
      'update',
      this.model.findByIdAndUpdate(id, item, returnNew ? { new: true } : {}),
      params,
    ).exec();
    if (!result) {
      throw new NotFoundException(`No item found with ID '${id}'`);
    }
    return result;
  }

  /**
   * @see Repository.delete
   */
  public async delete(id: string, params?: ResourceQuery): Promise<T> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`'${id}' is not a valid ObjectId`);
    }
    // Builds and executes query
    const result = await this.buildQuery('delete', this.model.findByIdAndDelete(id), params).exec();
    if (!result) {
      throw new NotFoundException(`No item found with ID '${id}'`);
    }
    if ((result as DeleteCascade).deleteCascade) {
      // Cascade delete
      await result.deleteCascade(this.model);
    }
    return result;
  }

  /**
   * @see Repository.list
   */
  public async list(params?: ResourceQuery): Promise<T[]> {
    return this.buildQuery('list', this.model.find({}), params).exec();
  }

  /**
   * @see Repository.findById
   */
  public async findById(id: string, params?: ResourceQuery): Promise<T> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`'${id}' is not a valid ObjectId`);
    }
    // Builds and executes query
    const result = await this.buildQuery('findById', this.model.findById(id), params).exec();
    if (!result) {
      throw new NotFoundException(`No item found with ID '${id}'`);
    }
    return result;
  }

  /**
   * @see Repository.findOne
   */
  public async findOne(cond: object = {}, params?: ResourceQuery): Promise<T> {
    const result = await this.buildQuery('findOne', this.model.findOne(cond), params).exec();
    if (!result) {
      throw new NotFoundException('No item found');
    }
    return result;
  }

  /**
   * @see Repository.find
   */
  public async find(cond: object = {}, params?: ResourceQuery): Promise<T[]> {
    return this.buildQuery('find', this.model.find(cond), params).exec();
  }

  /**
   * Construit une requête mongoose à partir des paramètres de la requête HTTP.
   * @param operation operation de la requête
   * @param params requête à effectuer
   * @param query paramètres de la requête HTTP
   */
  private buildQuery(operation: string, query: Query, params?: ResourceQuery): Query {
    if (this.optionsByOperation.has(operation) && params) {
      let sort: any;
      let skip: any;
      let limit: any;
      let select: any;
      let populate: any;
      this.optionsByOperation.get(operation).forEach(option => {
        switch (option) {
          case 'sort':
            if (params.sort) {
              sort = RepositoryService.parseStringOrJSON(params.sort);
              this.logger.debug(`Sort parameter = ${JSON.stringify(sort)} created for ${operation} operation`);
            }
            break;
          case 'skip':
            if (params.skip) {
              skip = RepositoryService.parseNumber(params.skip);
              this.logger.debug(`Skip parameter =  ${JSON.stringify(skip)} created for ${operation} operation`);
            }
            break;
          case 'limit':
            if (params.limit) {
              limit = RepositoryService.parseNumber(params.limit);
              this.logger.debug(`Limit parameter = ${JSON.stringify(limit)} created for ${operation} operation`);
            }
            break;
          case 'select':
            if (params.select) {
              select = RepositoryService.parseStringOrJSON(params.select);
              if (typeof select === 'string') {
                // If string parameter, parses it to create parameter (comma separated list)
                const selectSplit = select.split(',');
                select = {};
                for (let i = 0, length = selectSplit.length; i < length; i++) {
                  if (selectSplit[i][0] === '-') {
                    select[selectSplit[i].substring(1)] = 0;
                  } else {
                    select[selectSplit[i]] = 1;
                  }
                }
              }
              this.logger.debug(`Select parameter = ${JSON.stringify(select)} created for ${operation} operation`);
            }
            break;
          case 'populate':
            if (params.populate) {
              populate = RepositoryService.parseStringOrJSON(params.populate);
              if (typeof params.populate === 'string') {
                // If string parameter, parses it to create parameter (comma separated list)
                const populateSplit = params.populate.split(',');
                populate = [];
                for (let i = 0, length = populateSplit.length; i < length; i++) {
                  populate.push({ path: populateSplit[i] });
                  // Iterates over select elements already present to merge with populate ones
                  for (const key in select) {
                    if (select.hasOwnProperty(key)) {
                      if (key.indexOf(`${populate[i]}.`) === 0) {
                        if (populate[i].select) {
                          populate[i].select += ' ';
                        } else {
                          populate[i].select = '';
                        }
                        if (select[key] === 0) {
                          // Field should not be selected, removes it from populate
                          populate[i].select += '-';
                        }
                        // Concatenates select field in select of populate
                        populate[i].select += key.substring(populate[i].length + 1);
                        // Removes field from select as it is now in populate
                        delete select[key];
                      }
                    }
                  }
                  if (select) {
                    if (Object.keys(select).length > 0 && !select[populate[i]]) {
                      // If field is in populate but not in select, adds it to select
                      select[populate[i]] = 1;
                    } else if (Object.keys(select).length === 0) {
                      // Select if now empty, deletes it
                      select = undefined;
                    }
                  }
                }
              } else if (!Array.isArray(populate)) {
                // Convert unique populate value to an array
                populate = [populate];
              }
              this.logger.debug(`Populate parameter = ${JSON.stringify(populate)} created for ${operation} operation`);
            }
            break;
          default:
            this.logger.debug(`Parameter ${option} is unsupported for ${operation} operation`);
            break;
        }
      });
      if (sort) query.sort(sort);
      if (skip) query.skip(skip);
      if (limit) query.limit(limit);
      if (select) query.select(select);
      if (populate) query.populate(populate);
    }
    return query;
  }
}
