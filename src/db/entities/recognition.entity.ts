import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { TableName } from '@app/constants/app.enums';
import { UserEntity } from './user.entity';
import { EvaluationCriteriaEntity } from './evaluation-criteria.entity';
import { ObjectiveEntity } from './objective.entity';

@Entity(TableName.Recognition)
export class RecognitionEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public senderId: number;

  @Column()
  public receiverId: number;

  @Column()
  public content: string;

  @Column()
  public evaluationCriteriaId: number;

  @Column()
  public objectiveId: number;

  @Column()
  public cycleId: number;

  @ManyToOne(() => UserEntity, (user) => user.recognitionSender)
  @JoinColumn([{ name: 'senderId', referencedColumnName: 'id' }])
  public sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.recognitionReceiver)
  @JoinColumn([{ name: 'receiverId', referencedColumnName: 'id' }])
  public receiver: UserEntity;

  @ManyToOne(() => EvaluationCriteriaEntity, (evaluations) => evaluations.recognition)
  public evaluationCriteria: EvaluationCriteriaEntity;

  @ManyToOne(() => ObjectiveEntity, (objective) => objective.recognitions)
  public objective: ObjectiveEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;
}
