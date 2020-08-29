import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

@Entity(TableName.UserStar)
export class UserStarEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public star: number;

  @Column()
  public cycleId: number;

  @Column()
  public userId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;
}
