import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { RoleEntity } from '@app/db/entities/role.entity';
import { RoleDTO } from './role.dto';

@EntityRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> {
  getList = async (): Promise<RoleEntity[]> => {
    return await this.find();
  };

  createRole = async (data: RoleDTO): Promise<RoleEntity> => {
    return await this.save(data);
  };

  getRoleDetail = async (id: number): Promise<RoleEntity> => {
    return this.findOne({ where: { id } });
  };

  updateRole = async (id: number, data: Partial<RoleDTO>): Promise<RoleEntity> => {
    await this.update({ id }, data);
    return this.findOne({ id });
  };

  deleteRole = async (id: number): Promise<ObjectLiteral> => {
    await this.delete({ id });
    return { isDeleted: true };
  };
}
