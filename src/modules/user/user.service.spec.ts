import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import UserEntity from './entities/user.entity';
import UserPasswordResetEntity from './entities/user_password_reset.entity';
import { ConfigService } from '@nestjs/config';
import mockedConfigService from '../../common/mocks/config.service';
import EmailService from '../email/email.service';
import { mockReturnUser, registerDto } from './mock/user.mock';
import { RpcException } from '@nestjs/microservices';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UserService;
  let mockUserRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserPasswordResetEntity),
          useClass: Repository,
        },
        {
          provide: EmailService,
          useValue: {
            sendForgetPasswordEmail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockUserRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Should create and return user', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(mockUserRepository, 'create').mockReturnValue(mockReturnUser);
      jest.spyOn(mockUserRepository, 'save').mockResolvedValue(mockReturnUser);

      const result = await service.create(registerDto);

      // assertion
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockReturnUser.getUserProto());
    });

    it('Should throw exception if duplicate email', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');
      jest.spyOn(mockUserRepository, 'create').mockReturnValue(mockReturnUser);
      jest.spyOn(mockUserRepository, 'findOne').mockImplementation(() => {
        throw new RpcException(
          new BadRequestException(
            `User ${mockReturnUser.email} already exists`,
          ),
        );
      });
      jest.spyOn(mockUserRepository, 'create').mockReturnValue(mockReturnUser);

      // assertion
      await expect(service.create(registerDto)).rejects.toThrow(
        new RpcException(
          `Something went wrongError: User ${mockReturnUser.email} already exists`,
        ),
      );
    });

    it('Should throw RpcException Something went wrong if could not create user', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');
      jest.spyOn(mockUserRepository, 'create').mockReturnValue(mockReturnUser);
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(mockUserRepository, 'save').mockImplementation(() => {
        throw new Error();
      });

      await expect(service.create(registerDto)).rejects.toThrow(
        new RpcException(new Error('Something went wrongError')),
      );
    });
  });

  describe('getByEmail', () => {
    it('Should return user by email', async () => {
      jest
        .spyOn(mockUserRepository, 'findOne')
        .mockResolvedValue(mockReturnUser);

      const result = await service.getByEmail(registerDto.email);

      expect(mockUserRepository.findOne).toHaveBeenCalled();
      expect(result.email).toEqual(mockReturnUser.getUserProto().email);
    });
  });

  describe('findByCredentials', () => {
    it('Should return user by the provided credentials', async () => {
      jest
        .spyOn(service, 'getByEmail')
        .mockResolvedValue(mockReturnUser.getUserProto());
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => 'hashedPassword');

      const result = await service.findByCredentials(registerDto);
      expect(result.email).toEqual(mockReturnUser.getUserProto().email);
    });
  });

  describe('getByIds', () => {
    it('Should return user by id', async () => {
      const ids = [1, 2, 3, 4, 5];
      jest
        .spyOn(mockUserRepository, 'find')
        .mockResolvedValue([mockReturnUser]);

      // act
      const result = await service.getByIds(ids);

      // assert
      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(typeof result).toEqual('object');
    });
  });

  describe('getUsers', () => {
    it('Should return array of users', async () => {
      jest
        .spyOn(mockUserRepository, 'find')
        .mockResolvedValue([mockReturnUser]);

      const result = await service.getUsers({ email: registerDto.email });

      // assert
      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(typeof result).toEqual('object');
    });
  });
});
