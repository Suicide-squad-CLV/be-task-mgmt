import UserEntity from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import StatusEntity from './status.entity';
import { Task } from 'src/protos/task';

@Entity('tasks')
class TaskEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 200,
    name: 'task_title',
    nullable: false,
  })
  taskTitle: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'task_description',
    nullable: true,
  })
  taskDescription?: string;

  @Column({
    type: 'boolean',
    name: 'delete_flag',
    nullable: true,
    default: false,
  })
  isDeleted?: boolean;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'create_date',
    nullable: false,
    default: new Date(),
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'update_date',
    nullable: false,
    default: new Date(),
  })
  updatedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  user?: UserEntity;

  @ManyToOne(() => StatusEntity, (status) => status.tasks)
  status?: StatusEntity;

  constructor(partial: Partial<TaskEntity>) {
    Object.assign(this, partial);
  }

  toGRPCTask(): Task {
    return {
      id: this.id,
      taskTitle: this.taskTitle,
      taskDescription: this.taskDescription || '',
      isDeleted: this.isDeleted || false,
      assignUserId: this.user ? this.user.id.toString() : '',
    };
  }
}

export default TaskEntity;
