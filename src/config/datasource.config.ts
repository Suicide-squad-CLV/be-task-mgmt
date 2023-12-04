import { DataSource, DataSourceOptions } from 'typeorm';

const databaseSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: '12345678',
  database: 'task_management',
  port: 5432,
  entities: ['dist/**/*.entity{.ts,.js}'],
  // entities: [
  //   './src/**/entities/*.entity{.ts,.js}',
  //   './src/**/*.entity{.ts,.js}',
  // ],
  migrations: ['./src/migrations/*{.ts,.js}'], // created migration files
  synchronize: false,
};

export default new DataSource(databaseSourceOptions);
