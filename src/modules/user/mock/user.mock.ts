import { RegisterDto, User } from 'src/protos/user';
import UserEntity from '../entities/user.entity';

export const registerDto: RegisterDto = {
  email: 'test@example.com',
  fullname: 'Test User',
  password: 'abcd1234',
};

class UserMock implements User {
  id: number;
  fullname: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockReturnUser: UserEntity = {
  id: 1,
  fullname: 'Test User',
  avatar: 'http.jpg',
  password: 'abcd1234',
  createdAt: new Date(),
  email: 'test@example.com',
  isDeleted: 'N',
  refreshToken: '',
  updatedAt: new Date(),

  getUserProto() {
    return new UserMock();
  },
};
