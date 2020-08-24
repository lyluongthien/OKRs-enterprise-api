import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { TableName, EvaluationCriteriaEnum } from '@app/constants/app.enums';
import { CFRsEntity } from './cfrs.entity';

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

  @OneToMany(() => CFRsEntity, (cfrs) => cfrs.evaluationCriteria)
  public cfrs: CFRsEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;
}
