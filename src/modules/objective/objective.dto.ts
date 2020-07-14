import { KeyResultDTO } from '@app/modules/keyresult/keyresult.dto';

export class OkrsDTO {
  public objective: ObjectiveDTO;

  public keyResult: KeyResultDTO[];
}
export class ObjectiveDTO {
  public progress: number;

  public title: string;

  public isRootObjective: boolean;

  public userId: number;

  public cycleId: number;

  public parentObjectiveId?: number;

  public alignObjectivesId: number;
}
