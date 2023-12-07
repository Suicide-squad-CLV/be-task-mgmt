import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UserEntity from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto, User } from 'src/protos/user';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from 'src/database/postgres-error.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) {
      return user.getUserProto();
    }

    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByIds(ids: number[]) {
    return this.usersRepository.find({
      where: { id: In(ids) },
    });
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(registerDto: RegisterDto): Promise<User> {
    try {
      const hashedPassword = await this.hashData(registerDto.password);
      const createdUser = await this.usersRepository.create({
        ...registerDto,
        password: hashedPassword,
      });

      await this.usersRepository.save(createdUser);
      createdUser.password = undefined;

      return createdUser.getUserProto();
    } catch (error) {
      console.log(error);
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
}
