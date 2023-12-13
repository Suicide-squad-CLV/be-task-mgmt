import { SeederOptions } from 'typeorm-extension';
import { dbConfig } from './datasource.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MainSeeder } from '../database/seeds/MainSeeder';

const seedOrmConfig: DataSourceOptions & SeederOptions = {
  ...dbConfig,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  seeds: [MainSeeder],
};

export default new DataSource(seedOrmConfig);
