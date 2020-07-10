import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TableName, EvaluationCriteriaEnum } from '@app/constants/app.enums';

@Entity(TableName.EvaluationCriteria)
export class EvaluationCriteriaEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;

  @Column()
  public numberOfStar: number;

  @Column({ type: 'enum', enum: EvaluationCriteriaEnum, default: EvaluationCriteriaEnum.LEADER_TO_MEMBER })
  public type: EvaluationCriteriaEnum;
}
