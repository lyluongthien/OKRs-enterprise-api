import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { TableName } from '@app/constants/app.enums';
import { KeyResultEntity } from './key-result.entity';
import { UserEntity } from './user.entity';
import { CycleEntity } from './cycle.entity';
import { CheckinEntity } from './checkin.entity';
import { CFRsEntity } from './cfrs.entity';

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

  @Column('int', { array: true, nullable: true })
  public alignObjectivesId?: number[] | null;

  @Column()
  public isCompleted: boolean;

  @OneToMany(() => ObjectiveEntity, (objective) => objective.parentObjective)
  @JoinColumn([{ name: 'id', referencedColumnName: 'parentObjectiveId' }])
  public childObjectives: ObjectiveEntity[];

  @ManyToOne(() => ObjectiveEntity, (objectives) => objectives.childObjectives)
  @JoinColumn([{ name: 'parentObjectiveId', referencedColumnName: 'id' }])
  public parentObjective: ObjectiveEntity;

  @ManyToMany(() => ObjectiveEntity, (objectives) => objectives.objectiveAlignment)
  @JoinColumn([{ name: 'alignObjectivesId', referencedColumnName: 'id' }])
  public alignmentObjectives: ObjectiveEntity[];

  @ManyToMany(() => ObjectiveEntity, (objective) => objective.alignmentObjectives)
  @JoinColumn([{ name: 'id', referencedColumnName: 'alignObjectivesId' }])
  public objectiveAlignment: ObjectiveEntity;

  @OneToMany(() => KeyResultEntity, (keyresult) => keyresult.objective, { onDelete: 'CASCADE' })
  public keyResults: KeyResultEntity[];

  @OneToMany(() => CFRsEntity, (cfrs) => cfrs.objective)
  public cfrs: CFRsEntity[];

  @ManyToOne(() => UserEntity, (user) => user.objectives)
  public user: UserEntity;

  @ManyToOne(() => CycleEntity, (cycle) => cycle.objectives)
  public cycle: CycleEntity;

  @OneToMany(() => CheckinEntity, (checkin) => checkin.objective)
  public checkins: CheckinEntity[];
}
