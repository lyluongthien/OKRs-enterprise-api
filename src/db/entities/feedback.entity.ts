import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { TableName } from '@app/constants/app.enums';
import { CheckinEntity } from './checkin.entity';

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

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;
}
