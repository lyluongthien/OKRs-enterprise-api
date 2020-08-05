import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecognitionDTO {
  @IsNumber()
  @ApiProperty()
  public senderId: number;

  @ApiProperty()
  public receiverId: number;

  @ApiProperty()
  public content: string;

  @IsNumber()
  @ApiProperty()
  public evaluationCriteriaId: number;

  @IsNumber()
  @ApiProperty()
  public objectiveId: number;

  @IsNumber()
  @ApiProperty()
  public cycleId: number;
}
