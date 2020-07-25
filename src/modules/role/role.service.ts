import { Injectable, HttpStatus } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';

@Injectable()
export class RoleService {
  constructor(private _roleRepository: RoleRepository) {}
  public async getListRoles(): Promise<ResponseModel> {
    const data = await this._roleRepository.getListRoles();
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
