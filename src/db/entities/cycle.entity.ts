import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

@Entity(TableName.Cycle)
export class CycleEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ type: 'timestamp' })
  public startDate: Date;

  @Column({ type: 'timestamp' })
  public endDate: Date;
}
