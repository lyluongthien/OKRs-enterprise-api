import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { TableName, CheckinStatus, ConfidentLevel } from '@app/constants/app.enums';
import { KeyResultEntity } from './key-result.entity';

@Entity(TableName.Checkin)
export class CheckinEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public valueObtained: number;

  @Column()
  public confidentLevel: number;

  @Column()
  public progress: string;

  @Column()
  public problems: string;

  @Column()
  public plans: string;

  @Column()
  public checkinAt: Date;

  @Column()
  public nextCheckinDate: Date;

  @Column({ type: 'enum', enum: CheckinStatus, default: CheckinStatus.DRAFT })
  public status: CheckinStatus;

  @Column()
  public teamLeaderId: number;

  @Column()
  public keyResultId: number;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  @ManyToOne(() => KeyResultEntity, (keyResult) => keyResult.checkins)
  public keyResult: KeyResultEntity;
}
