import { Controller } from '@nestjs/common';
// import { AuthServiceControllerMethods } from 'src/protos/auth';
import { AuthenticateService } from './authenticate.service';

@Controller('authenticate')
// @AuthServiceControllerMethods()
export class AuthenticateController {
  constructor(private readonly authenService: AuthenticateService) {}

  // @HttpCode(200)
  // @Post('login')
  // async login(loginDto: LoginDto): Promise<User> {
  //   // const accessTokenCookie =
  //   //   this.authenticationService.getCookieWithJwtAccessToken(user.id);
  //   // const { cookie: refreshTokenCookie, token: refreshToken } =
  //   //   this.authenticationService.getCookieWithJwtRefreshToken(user.id);
  //   // await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
  //   // return user;
  //   return this.authenService.get
  // }
}
