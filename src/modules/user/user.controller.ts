import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

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
