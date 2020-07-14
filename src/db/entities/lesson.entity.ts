import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { TableName } from '@app/constants/app.enums';
import slugify from 'slugify';

@Entity(TableName.Lesson)
export class LessonEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  @Column()
  public slug: string;

  @BeforeInsert()
  public async updateSlug(): Promise<void> {
    (this.slug = slugify(this.title)),
      {
        lower: true,
      };
  }
}
