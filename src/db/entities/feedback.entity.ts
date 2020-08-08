import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { TableName } from '@app/constants/app.enums';
import { CheckinEntity } from './checkin.entity';
import { UserEntity } from './user.entity';
import { EvaluationCriteriaEntity } from './evaluation-criteria.entity';

@Entity(TableName.Feeback)
export class FeedbackEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public senderId: number;

  @Column()
  public receiverId: number;

  @Column()
  public content: string;

  @Column()
  public isLeaderToStaff: boolean;

  @Column()
  public evaluationCriteriaId: number;

  @Column()
  public checkinId: number;

  @OneToOne(() => CheckinEntity)
  public checkIn: CheckinEntity;

  @ManyToOne(() => UserEntity, (user) => user.sender)
  public sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receiver)
  public receiver: UserEntity;

  @ManyToOne(() => EvaluationCriteriaEntity, (evaluations) => evaluations.feedback)
  public evaluationCriteria: EvaluationCriteriaEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;
}
