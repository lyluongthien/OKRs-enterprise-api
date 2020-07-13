import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}
}
