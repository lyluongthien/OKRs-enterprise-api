import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

@Entity('Users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '250' })
  username: string;

  @Column({ type: 'varchar', length: '100' })
  emai: string;

  @Column({ type: 'varchar', length: '250' })
  @Exclude()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async commparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }
}
