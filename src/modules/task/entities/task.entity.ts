import UserEntity from 'src/modules/user/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import TaskStatusEntity from './task_status.entity';

@Entity('tasks')
class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  user_id: string;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  user: UserEntity;

  @Column({ nullable: true })
  task_status_id: string;

  @ManyToOne(() => TaskStatusEntity, (status) => status.tasks)
  task_status: TaskStatusEntity;

  @Column()
  title: Date;

  @Column()
  description: string;

  @DeleteDateColumn({ type: 'timestamp', default: null, nullable: true })
  deleted_at: Date;

  @Column()
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}

export default TaskEntity;
