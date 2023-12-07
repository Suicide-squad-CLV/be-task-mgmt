import { DeleteValue } from 'src/common/constants';
import TaskEntity from 'src/modules/task/entities/task.entity';
import { User } from 'src/protos/user';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column()
  email: string;

  @Column()
  password?: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks?: TaskEntity[];

  @Column({
    name: 'refresh_token',
    nullable: true,
  })
  refreshToken: string;

  @Column({
    type: 'char',
    enum: DeleteValue,
    default: DeleteValue.NO,
    name: 'is_deleted',
  })
  isDeleted: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  getUserProto(): User {
    console.log('toString()', this);
    return {
      id: this.id.toString(),
      fullname: this.fullname,
      email: this.email,
      password: this.password ?? '',
      avatar: this.avatar,
      refreshToken: this.refreshToken,
      isDeleted: this.isDeleted === DeleteValue.NO,
      createdAt: this.createdAt.toString(),
      updatedAt: this.updatedAt.toString(),
    };
  }
}

export default UserEntity;
