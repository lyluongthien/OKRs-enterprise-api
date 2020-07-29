import { Controller, Get } from '@nestjs/common';
import { ResponseModel } from '@app/constants/app.interface';
import { MetaService } from './meta.service';

@Controller('/api/v1/meta_data')
export class MetaController {
  constructor(private _metaService: MetaService) {}
  @Get('/teams')
  public async getListTeams(): Promise<ResponseModel> {
    return this._metaService.getListTeams();
  }
  @Get('/job_positions')
  public async getListJobPositions(): Promise<ResponseModel> {
    return this._metaService.getListJob();
  }
}
