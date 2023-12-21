import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { AppModule } from '../../app.module';

describe('DatabaseConnection', () => {
  let connection: Connection;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    connection = moduleRef.get<Connection>(Connection);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should establish a successful database connection', () => {
    expect(connection.isConnected).toBe(true);
  });
});
