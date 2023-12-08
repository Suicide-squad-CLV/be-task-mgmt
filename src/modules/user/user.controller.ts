import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  Empty,
  RegisterDto,
  User,
  UserCreadentials,
  UserEmail,
  UserGRPCServiceController,
  UserGRPCServiceControllerMethods,
  UserId,
  Users,
} from 'src/protos/user';
import { Observable } from 'rxjs';

@Controller('user')
@ApiTags('Users')
@ApiBearerAuth()
@UserGRPCServiceControllerMethods()
export class UserController implements UserGRPCServiceController {
  constructor(private readonly usersService: UserService) {}

  findOne(request: UserId): Promise<User> | Observable<User> | User {
    return this.usersService.getById(request.id);
  }

  findByEmail(email: UserEmail): Promise<User> | Observable<User> | User {
    return this.usersService.getByEmail(email.email);
  }

  findByCredentials(
    payload: UserCreadentials,
  ): Promise<User> | Observable<User> | User {
    return this.usersService.findByCredentials(payload);
  }

  findMany(): Promise<Users> | Observable<Users> | Users {
    return this.usersService.getUsers();
  }

  create(request: RegisterDto): Promise<User> | Observable<User> | User {
    return this.usersService.create(request);
  }

  @Post()
  forgotPassword(
    payload: UserEmail,
  ): Promise<Empty> | Observable<Empty> | Empty {
    console.log('payload1', payload);
    const a: UserEmail = { email: 'phidv9855@gmail.com' };
    return this.usersService.forgotPassword(a);
  }

  // @Post('avatar')
  // @UseGuards(JwtAuthenticationGuard)
  // @UseInterceptors(
  //   LocalFilesInterceptor({
  //     fieldName: 'file',
  //     path: '/avatars',
  //     fileFilter: (request, file, callback) => {
  //       if (!file.mimetype.includes('image')) {
  //         return callback(
  //           new BadRequestException('Provide a valid image'),
  //           false,
  //         );
  //       }
  //       callback(null, true);
  //     },
  //     limits: {
  //       fileSize: Math.pow(1024, 2), // 1MB
  //     },
  //   }),
  // )

  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'A new avatar for the user',
  //   type: FileUploadDto,
  // })
  // async addAvatar(
  //   @Req() request: RequestWithUser,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   return this.usersService.addAvatar(request.user.id, {
  //     path: file.path,
  //     filename: file.originalname,
  //     mimetype: file.mimetype,
  //   });
  // }
}
