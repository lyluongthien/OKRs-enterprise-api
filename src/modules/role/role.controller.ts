import { Controller, UseGuards, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import { ResponseModel } from '@app/constants/app.interface';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { AuthenticationGuard } from '../auth/authentication.guard';

@UseGuards(AuthenticationGuard)
@Controller('/api/v1/roles')
@SwaggerAPI()
export class RoleController {
  constructor(private _roleService: RoleService) {}

  @Get()
  public async getListRoles(): Promise<ResponseModel> {
    return this._roleService.getListRoles();
  }
}
