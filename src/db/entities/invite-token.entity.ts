import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

@Entity(TableName.InviteToken)
export class InviteTokenEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public token: string;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;
}
