import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import TaskEntity from './entities/task.entity';
import TaskStatusEntity from './entities/task_status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, TaskStatusEntity])],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
