import { IsString } from 'class-validator';

/**
 * Sample resource DTO.
 */
export class SampleDto {
  /**
   * Name.
   */
  @IsString()
  public name: string;
}
