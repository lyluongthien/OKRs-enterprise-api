import { ApiProperty } from '@nestjs/swagger';

import { KeyResultDTO } from '@app/modules/keyresult/keyresult.dto';
import { IsNotEmpty } from 'class-validator';

export class ObjectiveDTO {
  @ApiProperty()
  public id?: number;

  @ApiProperty()
  public progress: number;

  @ApiProperty()
  @IsNotEmpty()
  public title: string;

  @ApiProperty()
  public isRootObjective: boolean;

  @ApiProperty()
  @IsNotEmpty()
  public userId: number;

  @ApiProperty()
  @IsNotEmpty()
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
