import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AuthenticateModule } from './modules/authenticate/authenticate.module';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true, // cache property in this forRoot object.
      expandVariables: true,
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        PORT: Joi.number(),
        DATABASE_SYNC: Joi.boolean().default(false),
      }),
    }),
    DatabaseModule,
    AuthenticateModule,
    UserModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
