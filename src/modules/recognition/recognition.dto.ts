import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecognitionDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  public senderId: number;

  @IsNotEmpty()
  @ApiProperty()
  public receiverId: number;

  @ApiProperty()
  public content: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  public evaluationCriteriaId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  public objectiveId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  public cycleId: number;
}
