import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { Entity, BaseEntity, PrimaryColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import accessEnv from '@app/libs/accessEnv';
import { TableName } from '@app/constants/app.enums';
import { UserToken, JwtPayload } from '@app/constants/app.interfaces';
import { createJWT } from '@app/libs/jwt';

const SALT_WORK_FACTORY = accessEnv('SALT_WORK_FACTORY');
const _salt = genSaltSync(+SALT_WORK_FACTORY);

@Entity({ name: TableName.User })
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  email: string;

  password: string;

  @Column()
  passwordHashed: string;

  @Column()
  _salt: string;

  @Column()
  resetPasswordToken: string;

  @Column()
  fullName: string;

  @Column()
  avatarURL: string;

  @Column()
  gravatarURL: string;

  @Column()
  isActive: boolean;

  @Column()
  isApproved: boolean;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.passwordHashed = hashSync(this.password, _salt);
    delete this.password;
  }

  @BeforeUpdate()
  async updateHashPassword(): Promise<void> {
    if (this.passwordHashed !== this.passwordHashed) {
      this.passwordHashed = hashSync(this.passwordHashed, _salt);
    }
  }

  async verifyPassword(inputPassword: string): Promise<boolean> {
    return compareSync(inputPassword, this.passwordHashed);
  }

  generateToken(): UserToken {
    const expiresIn: number = 30 * 24 * 60 * 60; // 1 month
    const payload: JwtPayload = { id: this.id };
    const token = createJWT(payload, expiresIn);
    return {
      user: this,
      token: `Bearer ${token}`,
    };
  }
}
