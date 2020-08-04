import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FeedbackDTO {
  @IsNumber()
  @ApiProperty()
  public senderId: number;

  @IsNumber()
  @ApiProperty()
  public receiverId: number;

  @ApiProperty()
  public content: string;

  @IsNumber()
  @ApiProperty()
  public evaluationCriteriaId: number;

  @ApiProperty()
  public isLeaderToStaff?: boolean;

  @IsNumber()
  @ApiProperty()
  public checkinId: number;
}
