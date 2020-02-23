import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Search criteria DTO for log query.
 */
export class LogQueryDto {
  /**
   * Starting date.
   */
  @IsNumber()
  @IsOptional()
  @Transform(Number)
  public from?: number;

  /**
   * Limit date.
   */
  @IsNumber()
  @IsOptional()
  @Transform(Number)
  public until?: number;

  /**
   * Sort order of lines.
   */
  @IsString()
  @IsOptional()
  public order?: string;

  /**
   * Number of lines.
   */
  @IsNumber()
  @IsOptional()
  @Transform(Number)
  public limit?: number;
}
