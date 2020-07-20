import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
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

  @Column({ nullable: true })
  public parentObjectiveId?: number | null;

  @Column({ array: true, nullable: true })
  public alignObjectivesId?: number | null;

  @ManyToOne(() => ObjectiveEntity, (objective) => objective.parentObjectives)
  @JoinColumn([{ name: 'id', referencedColumnName: 'parentObjectiveId' }])
  public objective: ObjectiveEntity;

  @OneToMany(() => ObjectiveEntity, (objectives) => objectives.objective)
  @JoinColumn([{ name: 'parentObjectiveId', referencedColumnName: 'id' }])
  public parentObjectives: ObjectiveEntity[];

  @ManyToMany(() => ObjectiveEntity, (objectives) => objectives.objectiveAlignment)
  @JoinColumn([{ name: 'alignObjectivesId', referencedColumnName: 'id' }])
  public alignmentObjective: ObjectiveEntity[];

  @ManyToMany(() => ObjectiveEntity, (objective) => objective.alignmentObjective)
  @JoinColumn([{ name: 'id', referencedColumnName: 'alignObjectivesId' }])
  public objectiveAlignment: ObjectiveEntity;

  @OneToMany(() => KeyResultEntity, (keyresult) => keyresult.objective, { onDelete: 'CASCADE' })
  public keyResults: KeyResultEntity[];

  @ManyToOne(() => UserEntity, (user) => user.objectives)
  public user: UserEntity;

  @ManyToOne(() => CycleEntity, (cycle) => cycle.objectives)
  public cycle: CycleEntity;
}
