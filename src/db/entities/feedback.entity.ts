import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
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

  @ManyToOne(() => CheckinEntity, (checkin) => checkin.feedback)
  public checkin: CheckinEntity;

  @ManyToOne(() => UserEntity, (user) => user.feedbackSender)
  @JoinColumn([{ name: 'senderId', referencedColumnName: 'id' }])
  public sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.feedbackReceiver)
  @JoinColumn([{ name: 'receiverId', referencedColumnName: 'id' }])
  public receiver: UserEntity;

  @ManyToOne(() => EvaluationCriteriaEntity, (evaluations) => evaluations.feedback)
  public evaluationCriteria: EvaluationCriteriaEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;
}
