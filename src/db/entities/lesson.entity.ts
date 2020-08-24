import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

@Entity(TableName.Lesson)
export class LessonEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column()
  public thumbnail: string;

  @Column()
  public abstract: string;

  @Column()
  public index: number;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  @Column()
  public slug: string;
}
