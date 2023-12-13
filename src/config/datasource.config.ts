import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const config: ConfigService = new ConfigService();

const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: config.get<string>('DATABASE_HOST'),
  port: config.get<number>('DATABASE_PORT'),
  database: config.get<string>('DATABASE_NAME'),
  username: config.get<string>('DATABASE_USERNAME'),
  password: config.get<string>('DATABASE_PASSWORD'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['./src/migrations/*{.ts,.js}'],
  // migrationsRun: true,
  // migrationsTableName: 'typeorm_migrations',
  // cli: {
  //   migrationsDir: 'src/migrations',
  // },
  logging: true,
  synchronize: false,
};

export default new DataSource(dbConfig);
