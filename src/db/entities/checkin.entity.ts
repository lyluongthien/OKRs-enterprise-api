import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { TableName, CheckinStatus } from '@app/constants/app.enums';
import { CheckinDetailEntity } from './checkin-detail.entity';
import { ObjectiveEntity } from './objective.entity';

@Entity(TableName.Checkin)
export class CheckinEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public confidentLevel: number;

  @Column()
  public checkinAt: Date;

  @Column()
  public nextCheckinDate: Date;

  @Column({ type: 'enum', enum: CheckinStatus, default: CheckinStatus.DRAFT })
  public status: CheckinStatus;

  @Column()
  public teamLeaderId: number;

  @Column()
  public objectiveId: number;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  @OneToMany(() => CheckinDetailEntity, (checkinDetail) => checkinDetail.checkin)
  public checkinDetails: CheckinDetailEntity[];

  @ManyToOne(() => ObjectiveEntity, (objective) => objective.checkins)
  public objective: ObjectiveEntity;

  // public toJSON() {
  //   return {
  //     id: this.id,
  //     confident_level: this.confidentLevel,
  //     checkin_at: this.checkinAt,
  //     next_checkin_date: this.nextCheckinDate,
  //     status: this.status,
  //   };
  // }
}
