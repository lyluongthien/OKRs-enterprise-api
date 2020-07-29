import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { TableName } from '@app/constants/app.enums';
import { ObjectiveEntity } from './objective.entity';

@Entity(TableName.Cycle)
export class CycleEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ type: 'timestamptz' })
  public startDate: Date;

  @Column({ type: 'timestamptz' })
  public endDate: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  @OneToMany(() => ObjectiveEntity, (objectives) => objectives.cycle)
  public objectives: ObjectiveEntity[];
}
