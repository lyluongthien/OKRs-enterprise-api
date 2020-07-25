import { IsNotEmpty } from 'class-validator';

export class FeedbackDTO {
  @IsNotEmpty()
  public senderId: number;

  @IsNotEmpty()
  public receiverId: number;

  @IsNotEmpty()
  public content: string;

  @IsNotEmpty()
  public evaluationCriteriaId: number;

  public isLeaderToStaff?: boolean;

  @IsNotEmpty()
  public checkinId: number;
}
