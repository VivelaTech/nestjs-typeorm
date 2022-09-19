import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { EntitiesMetadataStorage } from './entities-metadata.storage';
import { EntityClassOrSchema } from './interfaces/entity-class-or-schema.type';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from './interfaces';
import { TypeOrmCoreModule } from './typeorm-core.module';
import { DEFAULT_DATA_SOURCE_NAME } from './typeorm.constants';
import { createTypeOrmProviders } from './typeorm.providers';
import { getDataSourceToken, TYPEORM_CUSTOM_REPOSITORY } from './common';

@Module({})
export class TypeOrmModule {
  static forRoot(options?: TypeOrmModuleOptions): DynamicModule {
    return {
      module: TypeOrmModule,
      imports: [TypeOrmCoreModule.forRoot(options)],
    };
  }

  static forFeature(
    entities: EntityClassOrSchema[] = [],
    dataSource:
      | DataSource
      | DataSourceOptions
      | string = DEFAULT_DATA_SOURCE_NAME,
  ): DynamicModule {
    const providers = createTypeOrmProviders(entities, dataSource);
    EntitiesMetadataStorage.addEntitiesByDataSource(dataSource, [...entities]);
    return {
      module: TypeOrmModule,
      providers: providers,
      exports: providers,
    };
  }

  static forCustomRepository<T extends new (...args: any[]) => any>(
    repositories: T[],
    dataSourceName?: string | DataSource | DataSourceOptions,
  ): DynamicModule {
    const providers: Provider[] = [];

    for (const repository of repositories) {
      const entity = Reflect.getMetadata(TYPEORM_CUSTOM_REPOSITORY, repository);

      if (!entity) {
        continue;
      }

      providers.push({
        inject: [getDataSourceToken(dataSourceName)],
        provide: repository,
        useFactory: (dataSource: DataSource): typeof repository => {
          const baseRepository = dataSource.getRepository<any>(entity);
          const customRepository = new repository(
            baseRepository.target,
            baseRepository.manager,
            baseRepository.queryRunner,
          );
          // we look at baseRepository's `manager` property
          // to always get actual one
          Object.defineProperty(customRepository, 'manager', {
            get() {
              return baseRepository.manager;
            },
          });

          return customRepository;
        },
      });
    }

    return {
      module: TypeOrmModule,
      providers: providers,
      exports: providers,
    };
  }

  static forRootAsync(options: TypeOrmModuleAsyncOptions): DynamicModule {
    return {
      module: TypeOrmModule,
      imports: [TypeOrmCoreModule.forRootAsync(options)],
    };
  }
}
