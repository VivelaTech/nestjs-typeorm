import { DynamicModule } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { EntityClassOrSchema } from './interfaces/entity-class-or-schema.type';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from './interfaces';
export declare class TypeOrmModule {
    static forRoot(options?: TypeOrmModuleOptions): DynamicModule;
    static forFeature(entities?: EntityClassOrSchema[], dataSource?: DataSource | DataSourceOptions | string): DynamicModule;
    static forCustomRepository<T extends new (...args: any[]) => any>(repositories: T[], dataSourceName?: string | DataSource | DataSourceOptions): DynamicModule;
    static forRootAsync(options: TypeOrmModuleAsyncOptions): DynamicModule;
}
