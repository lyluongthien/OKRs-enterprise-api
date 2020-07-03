import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

@Entity(TableName.JobPosition)
export class JobEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public createdAt: Date;

  @Column()
  public updatedAt: Date;
}
