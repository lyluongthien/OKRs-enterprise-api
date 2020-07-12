import { Injectable } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';

import { CycleEntity } from '@app/db/entities/cycle.entity';
import { CycleRepository } from './cycle.repository';
import { CycleDTO } from './cycle.dto';

@Injectable()
export class CycleService {
  constructor(private _cycleRepository: CycleRepository) {}

  public getListCycle(): Promise<CycleEntity[]> {
    return this._cycleRepository.getList();
  }

  public createCycle(data: CycleDTO): Promise<CycleEntity> {
    return this._cycleRepository.createCycle(data);
  }

  public getCycleDetail(id: number): Promise<CycleEntity> {
    return this._cycleRepository.getCycleDetail(id);
  }

  public updateCycle(id: number, data: Partial<CycleDTO>): Promise<CycleEntity> {
    return this._cycleRepository.updateCycle(id, data);
  }

  public deleteCycle(id: number): Promise<ObjectLiteral> {
    return this._cycleRepository.deleteCycle(id);
  }
}
