import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { TableName, TypeCFRsHistory } from '@app/constants/app.enums';
import { UserEntity } from './user.entity';
import { EvaluationCriteriaEntity } from './evaluation-criteria.entity';
import { ObjectiveEntity } from './objective.entity';
import { CheckinEntity } from './checkin.entity';

@Entity(TableName.CFRs)
export class CFRsEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public senderId: number;

  @Column()
  public receiverId: number;

  @Column()
  public content: string;

  @Column({ type: 'enum', enum: TypeCFRsHistory })
  public type: TypeCFRsHistory;

  @Column()
  public evaluationCriteriaId: number;

  @Column()
  public objectiveId: number;

  @Column()
  public cycleId: number;

  @Column()
  public checkinId: number;

  @ManyToOne(() => UserEntity, (user) => user.recognitionSender)
  @JoinColumn([{ name: 'senderId', referencedColumnName: 'id' }])
  public sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.recognitionReceiver)
  @JoinColumn([{ name: 'receiverId', referencedColumnName: 'id' }])
  public receiver: UserEntity;

  @ManyToOne(() => EvaluationCriteriaEntity, (evaluations) => evaluations.cfrs)
  public evaluationCriteria: EvaluationCriteriaEntity;

  @ManyToOne(() => ObjectiveEntity, (objective) => objective.cfrs)
  public objective: ObjectiveEntity;

  @ManyToOne(() => CheckinEntity, (checkin) => checkin.cfrs)
  public checkin: CheckinEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;
}
