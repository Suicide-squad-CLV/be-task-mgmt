import {
  Injectable,
  // UnauthorizedException,
} from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
// import { ConfigService } from '@nestjs/config';
import UserEntity from '../user/entities/user.entity';
import { Repository } from 'typeorm';
// import { UserService } from '../user/user.service';
import { LoginDto } from 'src/protos/auth';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthenticateService {
  constructor(
    // private jwtService: JwtService,
    // private configService: ConfigService,
    @InjectRepository(UserEntity)
    private authenRepository: Repository<UserEntity>, // private usersService: UserService,
  ) {}

  // async refreshToken(req: Request, res: Response): Promise<string> {
  //   const refreshToken = req.cookies['refresh_token'];

  //   if (!refreshToken) {
  //     throw new UnauthorizedException('Refresh token not found');
  //   }

  //   let payload = null;
  //   try {
  //     payload = this.jwtService.verify(refreshToken, {
  //       secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
  //     });
  //   } catch (error) {
  //     throw new UnauthorizedException('Invalid or expired refresh token');
  //   }

  //   const userExists = await this.authenRepository.find({
  //     where: { id: payload.sub },
  //   });

  //   if (!userExists) {
  //     throw new BadRequestException('User no longer exists');
  //   }

  //   const expiresIn = this.configService.get<number>('TOKEN_EXPIRED');
  //   const expiration = Math.floor(Date.now() / 1000) + (expiresIn ?? 3600);
  //   const accessToken = this.jwtService.sign(
  //     { ...payload, exp: expiration },
  //     {
  //       secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
  //     },
  //   );

  //   res.cookie('access_token', accessToken, { httpOnly: true });

  //   return accessToken;
  // }

  // private async generateToken(user: UserEntity) {
  // const payload = { username: user.fullname, sub: user.id };
  //
  // const accessToken = this.jwtService.sign(
  //   { ...payload },
  //   {
  //     secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
  //     expiresIn: '150sec',
  //   },
  // );

  // const refreshToken = this.jwtService.sign(payload, {
  //   secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
  //   expiresIn: '7d',
  // });

  // response.cookie('access_token', accessToken, { httpOnly: true });
  // response.cookie('refresh_token', refreshToken, {
  //   httpOnly: true,
  // });

  // return { user };
  // }

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.authenRepository.findOne({
      where: { email: loginDto.email },
    });

    if (
      user &&
      (await bcrypt.compare(loginDto.password, user.password ?? ''))
    ) {
      return user;
    }
    return null;
  }

  // public async register(registrationData: RegisterDto) {
  //   const hashedPassword = await bcrypt.hash(registrationData.password, 10);

  //   try {
  //     const createdUser = await this.usersService.create({
  //       ...registrationData,
  //       password: hashedPassword,
  //     });

  //     createdUser.password = undefined;
  //     return createdUser;
  //   } catch (error) {
  //     if (error?.code === PostgresErrorCode.UniqueViolation) {
  //       throw new HttpException(
  //         'User with that email already exists',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     throw new HttpException(
  //       'Something went wrong',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async login(loginDto: LoginDto) {
  //   const user = await this.validateUser(loginDto);

  //   if (!user) {
  //     throw new BadRequestException({
  //       invalidCredentials: 'Invalid credentials',
  //     });
  //   }

  //   return this.issueTokens(user, response);
  // }
}
