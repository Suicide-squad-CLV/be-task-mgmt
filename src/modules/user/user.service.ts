import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UserEntity from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto, User, UserCreadentials } from 'src/protos/user';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from 'src/database/postgres-error.enum';
import { RpcException } from '@nestjs/microservices';

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
      where: { id: In(ids) },
    });
  }

  async getUsers() {
    const response = await this.usersRepository
      .find()
      .then((users) => users.map((user) => user.getUserProto()));
    return { users: response };
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
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

  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
}
