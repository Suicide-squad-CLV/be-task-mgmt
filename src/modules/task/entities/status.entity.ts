import { Column, Entity, OneToMany } from 'typeorm';
import TaskEntity from './task.entity';

@Entity('task_status')
class StatusEntity {
  @Column({
    primary: true,
    type: 'varchar',
    length: 50,
    name: 'code',
    nullable: false,
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'status_name',
    nullable: false,
  })
  statusName: number;

  @Column({
    type: 'boolean',
    name: 'delete_flag',
    nullable: true,
    default: false,
  })
  isDeleted: string;

  @OneToMany(() => TaskEntity, (task) => task.status, { nullable: true })
  tasks?: TaskEntity[];
}

export default StatusEntity;
