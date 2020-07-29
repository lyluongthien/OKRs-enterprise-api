import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TableName, RoleEnum } from '@app/constants/app.enums';
import { UserEntity } from './user.entity';

@Entity(TableName.Role)
export class RoleEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.STAFF })
  public name!: RoleEnum;

  @OneToMany(() => UserEntity, (user) => user.role)
  public users: UserEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;
}
