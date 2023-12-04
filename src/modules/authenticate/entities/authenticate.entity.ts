import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Authenticate {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
