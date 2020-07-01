import { Injectable } from '@nestjs/common';
import { RoleEntity } from '@app/db/entities/role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  getListRole(): Promise<RoleEntity[]> {
    return this.roleRepository.find();
  }
}
