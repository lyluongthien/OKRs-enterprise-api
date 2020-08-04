import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FeedbackDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  public senderId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  public receiverId: number;

  @ApiProperty()
  public content: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  public evaluationCriteriaId: number;

  public isLeaderToStaff?: boolean;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  public checkinId: number;
}
