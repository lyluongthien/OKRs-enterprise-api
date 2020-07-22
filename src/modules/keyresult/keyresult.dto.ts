import { ApiProperty } from '@nestjs/swagger';

export class KeyResultDTO {
  @ApiProperty()
  public id?: number;

  @ApiProperty()
  public startValue: number;

  @ApiProperty()
  public valueObtained: number;

  @ApiProperty()
  public targetValue: number;

  @ApiProperty()
  public content: string;

  @ApiProperty()
  public progress: number;

  @ApiProperty()
  public links: string;

  public objectiveId: number;

  @ApiProperty()
  public measureUnitId: number;
}
