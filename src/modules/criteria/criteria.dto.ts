import { EvaluationCriteriaEnum } from '@app/constants/app.enums';
export class CriteriaDTO {
  public content: string;

  public numberOfStar: number;

  public type: EvaluationCriteriaEnum;
}
