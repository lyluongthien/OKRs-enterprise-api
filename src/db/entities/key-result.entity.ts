import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TableName } from '@app/constants/app.enums';
import { ObjectiveEntity } from './objective.entity';

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
  public progress: number;

  @Column()
  public links: string;

  @Column()
  public objectiveId: number;

  @Column()
  public measureUnitId: number;

  @ManyToOne(() => ObjectiveEntity, (objective) => objective.keyResults)
  public objective: ObjectiveEntity;
}
