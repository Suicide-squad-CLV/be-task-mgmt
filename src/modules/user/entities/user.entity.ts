import TaskEntity from 'src/modules/task/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  fullname: string;

  @Column()
  email?: string;

  @Column()
  password?: string;

  @Column()
  avatar: string;

  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks?: TaskEntity[];

  @Column()
  refresh_token: string;

  @Column()
  chnage_password_flag: string;

  @DeleteDateColumn({ type: 'timestamp', default: null, nullable: true })
  deleted_at: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}

export default UserEntity;
