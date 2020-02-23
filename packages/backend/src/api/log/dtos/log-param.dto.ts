import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Path parameter DTO for log query.
 */
export class LogParamDto {
  /**
   * Logger name.
   */
  @IsString()
  @IsOptional()
  public sub?: string;

  /**
   * Number of lines.
   */
  @IsNumber()
  @IsOptional()
  @Transform(Number)
  public lines?: number;
}
