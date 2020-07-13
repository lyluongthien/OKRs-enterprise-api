import { ObjectiveTypeEnum } from '@app/constants/app.enums';
import { KeyResultDTO } from '@app/modules/keyresult/keyresult.dto';

export class ObjectiveDTO {
  public type: ObjectiveTypeEnum;

  public progress: number;

  public title: string;

  public isRootObjective: boolean;

  public userId: number;

  public cycleId: number;

  public parentObjectiveId?: number;

  public alignObjectivesId?: number;

  public keyResult: KeyResultDTO[];
}
