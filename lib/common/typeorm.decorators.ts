import { Inject, SetMetadata } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { EntityClassOrSchema } from '../interfaces/entity-class-or-schema.type';
import { DEFAULT_DATA_SOURCE_NAME } from '../typeorm.constants';
import {
  getDataSourceToken,
  getEntityManagerToken,
  getRepositoryToken,
} from './typeorm.utils';

export const InjectRepository = (
  entity: EntityClassOrSchema,
  dataSource: string = DEFAULT_DATA_SOURCE_NAME,
): ReturnType<typeof Inject> => Inject(getRepositoryToken(entity, dataSource));

export const InjectDataSource: (
  dataSource?: DataSource | DataSourceOptions | string,
) => ReturnType<typeof Inject> = (
  dataSource?: DataSource | DataSourceOptions | string,
) => Inject(getDataSourceToken(dataSource));

/** @deprecated */
export const InjectConnection = InjectDataSource;

export const InjectEntityManager: (
  dataSource?: DataSource | DataSourceOptions | string,
) => ReturnType<typeof Inject> = (
  dataSource?: DataSource | DataSourceOptions | string,
) => Inject(getEntityManagerToken(dataSource));

export const TYPEORM_CUSTOM_REPOSITORY = 'TYPEORM_CUSTOM_REPOSITORY';

export const CustomRepository = (entity: Function): ClassDecorator => {
  return SetMetadata(TYPEORM_CUSTOM_REPOSITORY, entity);
};
