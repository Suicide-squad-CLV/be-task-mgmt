import { CreateAuthenticateInput } from './create-authenticate.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAuthenticateInput extends PartialType(CreateAuthenticateInput) {
  @Field(() => Int)
  id: number;
}
