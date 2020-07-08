import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { TableName, RoleEnum } from '@app/constants/app.enums';
import { UserEntity } from './user.entity';

@Entity(TableName.Role)
export class RoleEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ enum: [RoleEnum.ADMIN, RoleEnum.HR, RoleEnum.TEAM_LEADER, RoleEnum.STAFF] })
  public name: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @Column({ type: 'timestamp' })
  public updatedAt: Date;

  @OneToMany(() => UserEntity, (user) => user.role)
  public users: UserEntity[];
}
