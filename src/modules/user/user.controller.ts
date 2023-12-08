import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  Empty,
  PasswordPayload,
  RegisterDto,
  Response,
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

  forgotPassword(
    payload: UserEmail,
  ): Promise<Empty> | Observable<Empty> | Empty {
    return this.usersService.forgotPassword(payload);
  }

  removeUser(
    payload: UserId,
  ): Response | Promise<Response> | Observable<Response> {
    return this.usersService.removeUser(payload);
  }

  updatePassword(
    payload: PasswordPayload,
  ): Response | Promise<Response> | Observable<Response> {
    return this.usersService.updatePassword(payload);
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
