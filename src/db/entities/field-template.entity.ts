import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

@Entity(TableName.FieldTemplate)
export class FieldTemplateEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public columnName: string;

  @Column()
  public templateCheckinId: string;
}
