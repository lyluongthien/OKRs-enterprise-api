import { ApiProperty } from '@nestjs/swagger';

export class MeasureUnitDTO {
  @ApiProperty()
  public preset: string;

  @ApiProperty()
  public type: string;

  @ApiProperty()
  public index: number;
}
