import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  AvatarPayload,
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

  findMany(payload: UserEmail): Promise<Users> | Observable<Users> | Users {
    return this.usersService.getUsers(payload);
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

  updateAvatar(
    payload: AvatarPayload,
  ): Promise<User> | Observable<User> | User {
    return this.usersService.updateAvatar(payload);
  }
}
