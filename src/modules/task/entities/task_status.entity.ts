import UserEntity from 'src/modules/user/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import TaskEntity from './task.entity';

@Entity('task_status')
class TaskStatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  task_id: number;

  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks?: TaskEntity[];

  @Column()
  status_name: number;

  @DeleteDateColumn({ type: 'timestamp', default: null, nullable: true })
  deleted_at?: UserEntity;
}

export default TaskStatusEntity;
