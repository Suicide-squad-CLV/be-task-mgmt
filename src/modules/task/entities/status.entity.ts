import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @Column({
    type: 'varchar',
    length: 8,
    name: 'background_hex_color',
    nullable: true,
    default: '#ffffff', // white color
  })
  backgroundHexColor: string;

  @Column({
    type: 'varchar',
    length: 8,
    name: 'text_hex_color',
    nullable: true,
    default: '#000000', // black color
  })
  textHexColor: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'create_date',
    nullable: false,
    default: new Date(),
  })
  createdAt?: Date;

  @OneToMany(() => TaskEntity, (task) => task.status, { nullable: true })
  tasks?: TaskEntity[];

  toGRPCStatus(): GRPCStatus {
    // Map StatusEntity to GRPCStatus
    return {
      id: this.id,
      statusName: this.statusName,
      backgroundHexColor: this.backgroundHexColor,
      textHexColor: this.textHexColor,
    };
  }
}

export default StatusEntity;
