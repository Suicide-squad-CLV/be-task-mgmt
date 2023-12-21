import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import TaskEntity from './task.entity';

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

  @Column({
    comment: 'Allow to delete data',
    default: false,
  })
  persisted?: boolean;

  @OneToMany(() => TaskEntity, (task) => task.status, { nullable: true })
  tasks?: TaskEntity[];
}

export default StatusEntity;
