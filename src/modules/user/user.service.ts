import { Injectable } from '@nestjs/common';
import UserEntity from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AvatarPayload,
  PasswordPayload,
  RegisterDto,
  User,
  UserCreadentials,
  UserEmail,
  UserId,
} from 'src/protos/user';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from 'src/database/postgres-error.enum';
import { RpcException } from '@nestjs/microservices';
import EmailService from '../email/email.service';
import UserPasswordResetEntity from './entities/user_password_reset.entity';
import { ConfigService } from '@nestjs/config';
import {
  AUTHEN_PATH,
  DeleteValue,
  RESET_PWD_TIMEOOUT,
} from 'src/common/constants';
import * as moment from 'moment';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(UserPasswordResetEntity)
    private passwordRepository: Repository<UserPasswordResetEntity>,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
        isDeleted: DeleteValue.NO,
      },
    });
    if (user) {
      return user.getUserProto();
    }

    throw new RpcException('User with this email does not exist');
  }

  async findByCredentials(payload: UserCreadentials) {
    const user = await this.getByEmail(payload.email);
    if (!user) {
      throw new RpcException('User not found');
    }

    const isMatched = await bcrypt.compare(payload.password, user.password);

    if (!isMatched) {
      throw new RpcException('Wrong credentials provided');
    }

    return user;
  }

  async getByIds(ids: number[]) {
    return this.usersRepository.find({
      where: { id: In(ids), isDeleted: DeleteValue.NO },
    });
  }

  async getUsers() {
    const response = await this.usersRepository
      .find({
        where: { isDeleted: DeleteValue.NO },
      })
      .then((users) => users.map((user) => user.getUserProto()));
    return { users: response };
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id, isDeleted: DeleteValue.NO },
    });
    if (user) {
      return user.getUserProto();
    }
    throw new RpcException('User not found');
  }

  async create(registerDto: RegisterDto): Promise<User> {
    try {
      const hashedPassword = await this.hashData(registerDto.password);
      const createdUser = await this.usersRepository.create({
        ...registerDto,
        password: hashedPassword,
      });

      await this.usersRepository.save(createdUser);
      return createdUser.getUserProto();
    } catch (error) {
      console.log(error);
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new RpcException('User already exists');
      }

      throw new RpcException('Something went wrong' + error);
    }
  }

  async forgotPassword(payload: UserEmail) {
    const user = await this.getByEmail(payload.email);
    if (!user) {
      throw new RpcException('Email not found');
    }

    const entityCheck = await this.passwordRepository.findOne({
      where: { email: payload.email },
      order: {
        createdAt: 'DESC',
      },
    });

    // check the latest email have to within 10 minutes from now
    const now = moment();
    if (
      !entityCheck ||
      (entityCheck &&
        moment(entityCheck?.createdAt)
          .add(RESET_PWD_TIMEOOUT, 'minutes')
          .isBefore(now))
    ) {
      const token = this.generateRandomStr(30);
      const newPwdReset = await this.passwordRepository.create({
        email: payload.email,
        token: token,
      });
      await this.passwordRepository.save(newPwdReset);

      const link =
        this.configService.get<string>('APP_FRONTEND_URL') +
        AUTHEN_PATH +
        '?token=' +
        token;

      this.emailService.sendForgetPasswordEmail({
        email: payload.email,
        token: token,
        subject: '[TaskBan] Forgot password email',
        name: user.fullname,
        link: link,
        minute: RESET_PWD_TIMEOOUT,
      });
    }
  }

  // remove user
  async removeUser(payload: UserId) {
    const user = await this.usersRepository.findOne({
      where: { id: payload.id, isDeleted: DeleteValue.NO },
    });

    if (!user) {
      throw new RpcException('User is not exist');
    }

    await this.usersRepository.update(payload.id, {
      isDeleted: DeleteValue.YES,
    });

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }

  async updatePassword(payload: PasswordPayload) {
    const entityCheck = await this.passwordRepository.findOne({
      where: {
        token: payload.token,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!entityCheck) {
      throw new RpcException('Update password failed');
    }

    // hash password and update information
    const newPassword = await this.hashData(payload.password);
    await this.usersRepository.update(
      { email: entityCheck.email },
      {
        password: newPassword,
      },
    );

    // remove all request change password with this email
    await this.passwordRepository.delete({
      email: entityCheck.email,
    });

    return {
      success: true,
      message: 'Password updated successfully',
    };
  }

  async updateAvatar(payload: AvatarPayload) {
    const user = await this.usersRepository.findOne({
      where: { id: payload.id, isDeleted: DeleteValue.NO },
    });
    if (!user) {
      throw new RpcException('User is not found');
    }

    const newUser = await this.usersRepository.save({
      ...user,
      avatar: payload.avatar,
    });

    return {
      id: newUser.id,
      fullname: newUser.fullname,
      email: newUser.email,
      password: newUser.password ?? '',
      avatar: newUser.avatar,
      refreshToken: newUser.refreshToken,
      isDeleted: newUser.isDeleted === DeleteValue.NO,
      createdAt: newUser.createdAt.toString(),
      updatedAt: newUser.updatedAt.toString(),
    };
  }

  private generateRandomStr(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }

  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
}
