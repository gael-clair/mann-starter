import { IsMongoId, IsOptional, IsString } from 'class-validator';

/**
 * REST API resource request path parameters DTO.
 */
export class ResourceParamDto {
  /**
   * Resource path.
   */
  @IsString()
  @IsOptional()
  public resource?: string;

  /**
   * Id of resource item.
   */
  @IsMongoId()
  @IsOptional()
  public id?: string;
}
