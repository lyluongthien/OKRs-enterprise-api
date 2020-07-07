import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TableName } from '@app/constants/app.enums';
import { UserEntity } from './user.entity';

@Entity(TableName.Role)
export class RoleEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public createdAt: Date;

  @Column()
  public updatedAt: Date;

  @OneToMany(
    (type) => UserEntity,
    (user) => user.role,
  )
  users: UserEntity[];
}
