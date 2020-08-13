import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { TableName } from '@app/constants/app.enums';
import { ObjectiveEntity } from './objective.entity';
import { MeasureUnitEntity } from './measure-unit.entity';

@Entity(TableName.KeyResult)
export class KeyResultEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public startValue: number;

  @Column()
  public valueObtained: number;

  @Column()
  public targetValue: number;

  @Column()
  public content: string;

  @Column()
  public linkPlans: string;

  @Column()
  public linkResults: string;

  @Column()
  public objectiveId: number;

  @Column()
  public measureUnitId: number;

  public progress: number;

  @ManyToOne(() => ObjectiveEntity, (objective) => objective.keyResults)
  public objective: ObjectiveEntity;

  @OneToOne(() => MeasureUnitEntity)
  @JoinColumn()
  public measureUnit: MeasureUnitEntity;
}
