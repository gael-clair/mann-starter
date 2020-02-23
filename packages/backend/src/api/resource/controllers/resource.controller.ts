import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Document } from 'mongoose';

import { LoggerService } from '@app/logger/services';

import { RESOURCES_SERVICES } from '../constants';
import { ResourceLogger } from '../decorators';
import { ResourceParamDto } from '../dtos';
import { FieldsFilterInterceptor } from '../interceptors';
import { Repository, ResourceQuery } from '../models';
import { ResourcesService } from '../services';

/**
 * Main controller of REST resource API.
 */
@UseInterceptors(FieldsFilterInterceptor)
@Controller()
export class ResourceController<D extends Document, T extends Repository<D>> {
  constructor(
    @ResourceLogger() private readonly logger: LoggerService,
    @Inject(RESOURCES_SERVICES) private readonly resourcesService: ResourcesService<D, T>,
  ) {}

  /**
   * Returns an array of all available resources.
   */
  @Get()
  public listResources(): string[] {
    return this.resourcesService.getResourcesPath();
  }

  /**
   *
   * Creates a new item of a resource and returns created item.
   * @param resourceParamDto resource request path parameters DTO.
   * @param item item to create
   */
  @Post(':resource')
  public async addItem(@Param() resourceParamDto: ResourceParamDto, @Body() item: object): Promise<D> {
    return this.resourcesService.getResourceServiceByResourcePath(resourceParamDto.resource).create(item);
  }

  /**
   * Returns an array of resource items.
   * @param resourceParamDto resource request path parameters DTO.
   * @param query query parameters
   */
  @Get(':resource')
  public async listItems(@Param() resourceParamDto: ResourceParamDto, @Query() query: ResourceQuery): Promise<D[]> {
    return this.resourcesService.getResourceServiceByResourcePath(resourceParamDto.resource).list(query);
  }

  /**
   * Returns resource items corresponding to given search criteria.
   * @param resourceParamDto resource request path parameters DTO.
   * @param cond search criteria
   * @param query query parameters
   */
  @Post(':resource/search')
  @HttpCode(200)
  public async searchItem(
    @Param() resourceParamDto: ResourceParamDto,
    @Body() cond: object,
    @Query() query: ResourceQuery,
  ): Promise<D[]> {
    return this.resourcesService.getResourceServiceByResourcePath(resourceParamDto.resource).find(cond, query);
  }

  /**
   * Returns resource item corresponding to given search criteria.
   * @param resourceParamDto resource request path parameters DTO.
   * @param cond search criteria
   * @param query query parameters
   */
  @Post(':resource/find')
  @HttpCode(200)
  public async searchOneItem(
    @Param() resourceParamDto: ResourceParamDto,
    @Body() cond: object,
    @Query() query: ResourceQuery,
  ): Promise<D> {
    return this.resourcesService.getResourceServiceByResourcePath(resourceParamDto.resource).findOne(cond, query);
  }

  /**
   * Returns one resource item by its id.
   * @param resourceParamDto resource request path parameters DTO.
   * @param query query parameters
   */
  @Get(':resource/:id')
  public async getItem(@Param() resourceParamDto: ResourceParamDto, @Query() query: ResourceQuery): Promise<D> {
    return this.resourcesService
      .getResourceServiceByResourcePath(resourceParamDto.resource)
      .findById(resourceParamDto.id, query);
  }

  /**
   * Updates a resource item by its id and returns updated item.
   * @param resourceParamDto resource request path parameters DTO.
   * @param item updates
   * @param query query parameters
   */
  @Put(':resource/:id')
  public async updateItem(
    @Param() resourceParamDto: ResourceParamDto,
    @Body() item: object,
    @Query() query: ResourceQuery,
  ): Promise<D> {
    return this.resourcesService
      .getResourceServiceByResourcePath(resourceParamDto.resource)
      .update(resourceParamDto.id, item, true, query);
  }

  /**
   * Deletes a resource item by its id and returns it.
   * @param resourceParamDto resource request path parameters DTO.
   * @param query query parameters
   */
  @Delete(':resource/:id')
  public async deleteItem(@Param() resourceParamDto: ResourceParamDto, @Query() query: ResourceQuery): Promise<D> {
    return this.resourcesService
      .getResourceServiceByResourcePath(resourceParamDto.resource)
      .delete(resourceParamDto.id, query);
  }
}
