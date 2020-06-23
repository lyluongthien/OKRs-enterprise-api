import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmOptions } from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmOptions,
    }),
  ],
})
export class RadioTypeOrmModule {
  static forRoot(connectionName: string): DynamicModule {
    return {
      module: RadioTypeOrmModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            ...TypeOrmOptions.createTypeOrmOptions(),
            name: connectionName,
          }),
        }),
      ],
    };
  }
}
