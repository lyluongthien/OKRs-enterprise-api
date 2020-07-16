import { createHash } from 'crypto';
import { hashSync } from 'bcryptjs';
import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { TableName } from '@app/constants/app.enums';
import { _salt } from '@app/constants/app.config';
import { JobEntity } from './job.entity';
import { RoleEntity } from './role.entity';
import { TeamEntity } from './team.entity';

@Entity({ name: TableName.User })
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public email: string;

  @Column()
  public password: string;

  @Column()
  public _salt: string;

  @Column()
  public fullName: string;

  @Column()
  public avatarURL: string;

  @Column()
  public gravatarURL: string;

  @Column()
  public jobPositionId?: number;

  @Column()
  public roleId: number;

  @Column()
  public teamId: number;

  @Column()
  public isLeader: boolean;

  @Column()
  public isActive: boolean;

  @Column()
  public isApproved: boolean;

  @Column()
  public resetPasswordToken?: string;

  @Column({ type: 'timestamptz' })
  public resetPasswordTokenExpire?: Date;

  @Column()
  public deactivatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  public role: RoleEntity;

  @ManyToOne(() => JobEntity, (jobPosition) => jobPosition.users)
  public jobPosition: JobEntity;

  @ManyToOne(() => TeamEntity, (team) => team.users)
  public team: TeamEntity;

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    this.password = hashSync(this.password, _salt);
  }

  @BeforeInsert()
  public async generateGravatar(): Promise<void> {
    const sha512 = createHash('sha512').update(this.email).digest('hex');
    const size = 200;
    this.gravatarURL = `https://gravatar.com/avatar/${sha512}?s=${size}&d=retro`;
  }

  @BeforeUpdate()
  public async updateHashPassword(): Promise<void> {
    if (this.password !== this.password) {
      this.password = hashSync(this.password, _salt);
    }
  }
}
