import { Entity, BaseEntity, PrimaryColumn, Column } from 'typeorm';
import { TableName } from '../../constants/Enums';

@Entity({ name: TableName.User })
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  email: string;
}
