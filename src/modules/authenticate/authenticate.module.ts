import { Module } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthenticateResolver } from './authenticate.resolver';

@Module({
  providers: [AuthenticateResolver, AuthenticateService],
})
export class AuthenticateModule {}
