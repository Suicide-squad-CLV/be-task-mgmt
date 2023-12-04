import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAuthenticateInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
