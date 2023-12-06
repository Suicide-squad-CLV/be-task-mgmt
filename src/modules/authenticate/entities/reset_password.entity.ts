import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('reset_password')
class ResetPasswordEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  token: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @Field({ nullable: true, defaultValue: Date.now() })
  created_at: Date;
}

export default ResetPasswordEntity;
