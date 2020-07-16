import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { TableName } from '@app/constants/app.enums';
import { KeyResultEntity } from './key-result.entity';
import { UserEntity } from './user.entity';
import { CycleEntity } from './cycle.entity';

@Entity(TableName.Objective)
export class ObjectiveEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public progress: number;

  @Column()
  public title: string;

  @Column()
  public isRootObjective: boolean;

  @Column()
  public userId: number;

  @Column()
  public cycleId: number;

  @Column()
  public parentObjectiveId?: number;

  @Column({ array: true })
  public alignObjectivesId: number;

  @ManyToOne(() => ObjectiveEntity, (objective) => objective.objectives)
  @JoinColumn([{ name: 'id', referencedColumnName: 'id' }])
  public objective: ObjectiveEntity;

  @OneToMany(() => ObjectiveEntity, (objectives) => objectives.objective)
  @JoinColumn([{ name: 'id', referencedColumnName: 'id' }])
  public objectives: ObjectiveEntity[];

  @OneToMany(() => KeyResultEntity, (keyresult) => keyresult.objective)
  public keyResults: KeyResultEntity[];

  @ManyToOne(() => UserEntity, (user) => user.objectives)
  public user: UserEntity;

  @ManyToOne(() => CycleEntity, (cycle) => cycle.objectives)
  public cycle: CycleEntity;
}
