import { Controller, Get, UseGuards } from '@nestjs/common';

import { CheckinService } from './checkin.service';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { ApiParam, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@Controller('/api/v1/checkins')
@UseGuards(AuthenticationGuard)
export class CheckinController {
  constructor(private readonly _checkinService: CheckinService) {}

  @Get()
  public async index(): Promise<string> {
    return 'Phan Van Duc';
  }
}
