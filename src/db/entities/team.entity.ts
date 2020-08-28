import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { TableName } from '@app/constants/app.enums';
import { UserEntity } from './user.entity';
@Entity(TableName.Team)
export class TeamEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  @OneToMany(() => UserEntity, (user) => user.team)
  public users: UserEntity[];
}
