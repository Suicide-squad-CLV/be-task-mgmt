import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  FindUserInfo,
  RegisterDto,
  User,
  UserEmail,
  UserGRPCServiceController,
  UserGRPCServiceControllerMethods,
  UserId,
  Users,
} from 'src/protos/user';
import { Observable } from 'rxjs';

@Controller('user')
@ApiTags('Users')
@UserGRPCServiceControllerMethods()
export class UserController implements UserGRPCServiceController {
  constructor(private readonly usersService: UserService) {}

  findOne(request: UserId): Promise<User> | Observable<User> | User {
    console.log('request', request);
    return null as unknown as User;
  }

  findByEmail(email: UserEmail): Promise<User> | Observable<User> | User {
    return this.usersService.getByEmail(email.email);
  }

  findMany(request: FindUserInfo): Promise<Users> | Observable<Users> | Users {
    console.log('request', request);
    return null as unknown as Users;
  }

  create(request: RegisterDto): Promise<User> | Observable<User> | User {
    return this.usersService.create(request);
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
