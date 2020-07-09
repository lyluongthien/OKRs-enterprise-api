import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TableName } from '@app/constants/app.enums';
import { UserEntity } from './user.entity';
import { TeamEntity } from './team.entity';

@Entity(TableName.UserTeam)
export class UserTeamEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public isLeader: boolean;

  @Column()
  public userId: number;

  @Column()
  public teamId: number;

  @ManyToOne(() => UserEntity, (user) => user.userToTeams)
  public user: UserEntity;

  @ManyToOne(() => TeamEntity, (team) => team.userToTeams)
  public team: TeamEntity;
}
