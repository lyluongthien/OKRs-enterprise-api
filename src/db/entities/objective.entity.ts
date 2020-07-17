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
  public alignObjectivesId?: number;

  @ManyToOne(() => ObjectiveEntity, (objective) => objective.parentObjectives, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'id', referencedColumnName: 'parentObjectiveId' }])
  public objective: ObjectiveEntity;

  @OneToMany(() => ObjectiveEntity, (objectives) => objectives.objective, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'parentObjectiveId', referencedColumnName: 'id' }])
  public parentObjectives: ObjectiveEntity[];

  @OneToMany(() => KeyResultEntity, (keyresult) => keyresult.objective, { onDelete: 'CASCADE' })
  public keyResults: KeyResultEntity[];

  @ManyToOne(() => UserEntity, (user) => user.objectives)
  public user: UserEntity;

  @ManyToOne(() => CycleEntity, (cycle) => cycle.objectives)
  public cycle: CycleEntity;
}
