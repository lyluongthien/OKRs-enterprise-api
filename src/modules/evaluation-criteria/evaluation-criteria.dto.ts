import { EvaluationCriteriaEnum } from '@app/constants/app.enums';
import { ApiProperty } from '@nestjs/swagger';
export class EvaluationDTO {
  @ApiProperty()
  public content: string;

  @ApiProperty()
  public numberOfStar: number;

  @ApiProperty()
  public type: EvaluationCriteriaEnum;
}
