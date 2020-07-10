import { IsNotEmpty } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UserTeamDTO {
  @IsNotEmpty()
  @Optional()
  public isLeader: boolean;

  @IsNotEmpty()
  @Optional()
  public userId: number;

  @IsNotEmpty()
  @Optional()
  public teamId: number;
}
