import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { TableName } from '@app/constants/app.enums';
import { UserTeamEntity } from './user-team.entity';
@Entity(TableName.Teams)
export class TeamEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public createdAt: Date;

  @Column()
  public updatedAt: Date;

  @OneToMany(
    () => UserTeamEntity,
    (userTeam) => userTeam.team,
  )
  public userToTeams: UserTeamEntity[];
}
