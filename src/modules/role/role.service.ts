import { Injectable } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';

import { RoleRepository } from './role.repository';
import { RoleDTO } from './role.dto';
import { RoleEntity } from '@app/db/entities/role.entity';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  public getListRole(): Promise<RoleEntity[]> {
    return this.roleRepository.getList();
  }

  public createRole(data: RoleDTO): Promise<RoleEntity> {
    return this.roleRepository.createRole(data);
  }

  public getRoleDetail(id: number): Promise<RoleEntity> {
    return this.roleRepository.getRoleDetail(id);
  }

  public updateRole(id: number, data: RoleDTO): Promise<RoleEntity> {
    return this.roleRepository.updateRole(id, data);
  }

  public deleteRole(id: number): Promise<ObjectLiteral> {
    return this.roleRepository.deleteRole(id);
  }
}
