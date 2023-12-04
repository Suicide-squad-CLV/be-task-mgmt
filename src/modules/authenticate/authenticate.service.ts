import { Injectable } from '@nestjs/common';
import { CreateAuthenticateInput } from './dto/create-authenticate.input';
import { UpdateAuthenticateInput } from './dto/update-authenticate.input';

@Injectable()
export class AuthenticateService {
  create(createAuthenticateInput: CreateAuthenticateInput) {
    return 'This action adds a new authenticate';
  }

  findAll() {
    return `This action returns all authenticate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authenticate`;
  }

  update(id: number, updateAuthenticateInput: UpdateAuthenticateInput) {
    return `This action updates a #${id} authenticate`;
  }

  remove(id: number) {
    return `This action removes a #${id} authenticate`;
  }
}
