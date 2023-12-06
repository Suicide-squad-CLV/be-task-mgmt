import { Module } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthenticateController } from './authenticate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ResetPasswordEntity from './entities/reset_password.entity';
import UserEntity from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResetPasswordEntity, UserEntity]),
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET || 'secret123',
    //   signOptions: { expiresIn: '50m' },
    // }),
    // PassportModule
  ],
  controllers: [AuthenticateController],
  providers: [AuthenticateService],
})
export class AuthenticateModule {}
