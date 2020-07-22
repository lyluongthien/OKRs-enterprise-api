import { ApiProperty } from '@nestjs/swagger';

import { KeyResultDTO } from '@app/modules/keyresult/keyresult.dto';

export class ObjectiveDTO {
  @ApiProperty()
  public id?: number;

  @ApiProperty()
  public progress: number;

  @ApiProperty()
  public title: string;

  @ApiProperty()
  public isRootObjective: boolean;

  public userId: number;

  @ApiProperty()
  public cycleId: number;

  @ApiProperty()
  public parentObjectiveId?: number;

  @ApiProperty()
  public alignObjectivesId?: number;
}
export class OkrsDTO {
  @ApiProperty()
  public objective: ObjectiveDTO;

  @ApiProperty()
  public keyResult: KeyResultDTO[];
}
