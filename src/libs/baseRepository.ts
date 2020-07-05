import { Repository, EntityRepository, ObjectLiteral, FindOneOptions, FindManyOptions, SaveOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@EntityRepository()
export class BaseRepository<T> extends Repository<T> {
  public async getEntitiesByOptions(option: FindManyOptions): Promise<T[]> {
    return await this.find(option);
  }

  public async createEntity(entity: T, options?: SaveOptions): Promise<T> {
    return await this.save(entity, options);
  }

  public async findOneByID(id: number, options?: FindOneOptions): Promise<T> {
    return await this.findOne(id, options);
  }

  public async findOneWithCondition(options: FindOneOptions): Promise<T> {
    return await this.findOne(options);
  }

  public async updateEntityByID(id: number, data: QueryDeepPartialEntity<T>): Promise<ObjectLiteral[]> {
    const result = await (await this.update(id, { ...data })).generatedMaps;
    return result;
  }
  public async deleteEntityByID(id: number): Promise<number> {
    const rowDeleted = await (await this.delete(id)).affected;
    return rowDeleted;
  }

  public async softDeleteEntityByID(id: number): Promise<number> {
    const rowSoftDeleted = await (await this.softDelete(id)).affected;
    return rowSoftDeleted;
  }
}
