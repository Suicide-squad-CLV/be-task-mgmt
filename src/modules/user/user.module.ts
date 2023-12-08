import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import UserEntity from './entities/user.entity';
import UserPasswordResetEntity from './entities/user_password_reset.entity';
import EmailService from '../email/email.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserPasswordResetEntity])],
  controllers: [UserController],
  providers: [UserService, EmailService, ConfigService],
})
export class UserModule {}
