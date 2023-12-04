import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthenticateService } from './authenticate.service';
import { Authenticate } from './entities/authenticate.entity';
import { CreateAuthenticateInput } from './dto/create-authenticate.input';
import { UpdateAuthenticateInput } from './dto/update-authenticate.input';

@Resolver(() => Authenticate)
export class AuthenticateResolver {
  constructor(private readonly authenticateService: AuthenticateService) {}

  @Mutation(() => Authenticate)
  createAuthenticate(@Args('createAuthenticateInput') createAuthenticateInput: CreateAuthenticateInput) {
    return this.authenticateService.create(createAuthenticateInput);
  }

  @Query(() => [Authenticate], { name: 'authenticate' })
  findAll() {
    return this.authenticateService.findAll();
  }

  @Query(() => Authenticate, { name: 'authenticate' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.authenticateService.findOne(id);
  }

  @Mutation(() => Authenticate)
  updateAuthenticate(@Args('updateAuthenticateInput') updateAuthenticateInput: UpdateAuthenticateInput) {
    return this.authenticateService.update(updateAuthenticateInput.id, updateAuthenticateInput);
  }

  @Mutation(() => Authenticate)
  removeAuthenticate(@Args('id', { type: () => Int }) id: number) {
    return this.authenticateService.remove(id);
  }
}
