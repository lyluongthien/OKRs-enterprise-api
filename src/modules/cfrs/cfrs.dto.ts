import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TypeCFRsHistory } from '@app/constants/app.enums';

export class CFRsDTO {
  @IsNumber()
  @ApiProperty()
  public senderId: number;

  @IsNumber()
  @ApiProperty()
  public receiverId: number;

  @ApiProperty()
  public objectiveId: number;

  @ApiProperty()
  public content: string;

  @ApiProperty()
  public type: TypeCFRsHistory;

  @IsNumber()
  @ApiProperty()
  public evaluationCriteriaId: number;

  @ApiProperty()
  public cycleId: number;

  @IsNumber()
  @ApiProperty()
  public checkinId: number;
}
