import { Injectable } from '@nestjs/common';
import { RoleEntity } from '@app/db/entities/role.entity';
import { RoleRepository } from './role.repository';
import { RoleDTO } from './role.dto';
import { ObjectLiteral } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  getListRole(): Promise<RoleEntity[]> {
    return this.roleRepository.find();
  }

  createRole(data: RoleDTO): Promise<RoleEntity> {
    return this.roleRepository.createRole(data);
  }

  getRoleDetail(id: number): Promise<RoleEntity> {
    return this.roleRepository.getRoleDetail(id);
  }

  updateRole(id: number, data: Partial<RoleDTO>): Promise<RoleEntity> {
    return this.roleRepository.updateRole(id, data);
  }

  deleteRole(id: number): Promise<ObjectLiteral> {
    return this.roleRepository.deleteRole(id);
  }
}
