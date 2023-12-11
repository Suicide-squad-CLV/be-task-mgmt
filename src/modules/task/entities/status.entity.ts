import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import TaskEntity from './task.entity';
import { GRPCStatus } from 'src/protos/task';

@Entity('task_status')
class StatusEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'status_name',
    nullable: false,
  })
  statusName: string;

  @Column({
    type: 'boolean',
    name: 'delete_flag',
    nullable: true,
    default: false,
  })
  isDeleted: boolean;

  @OneToMany(() => TaskEntity, (task) => task.status, { nullable: true })
  tasks?: TaskEntity[];

  toGRPCStatus(): GRPCStatus {
    // Map StatusEntity to GRPCStatus
    return {
      id: this.id,
      statusName: this.statusName,
    };
  }
}

export default StatusEntity;
