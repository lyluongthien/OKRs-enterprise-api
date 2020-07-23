import { IsNotEmpty, IsNumber } from 'class-validator';

export class FeedbackDTO {
  @IsNotEmpty()
  @IsNumber()
  public inferiorId: number;

  public superiorId: number;

  @IsNotEmpty()
  public content: string;

  @IsNotEmpty()
  @IsNumber()
  public evaluationCriteriaId: number;

  @IsNotEmpty()
  @IsNumber()
  public objectiveId: number;

  @IsNotEmpty()
  @IsNumber()
  public cycleId: number;
}
