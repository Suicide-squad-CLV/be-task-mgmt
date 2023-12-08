import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import TaskEntity from './entities/task.entity';
import { ILike, Repository } from 'typeorm';
import { FindTasks, Task, TaskList } from 'src/protos/task';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  async getAll(request: FindTasks): Promise<TaskList> {
    console.log(request);

    // Define condition for where clause based on FindTaskInfro value
    const condition: any = {};
    if (request.title) {
      condition.taskTitle = ILike(`%${request.title}%`);
    }

    // Get tasks based on condition
    const tasks = await this.taskRepository.find({
      where: condition,
    });

    if (tasks) {
      // Map TaskEntity to Task in GRPC Return
      const result: Task[] = tasks.map((task: TaskEntity) => task.toGRPCTask());
      return { tasks: result };
    }

    // Throw error if there is no task
    throw new HttpException('Can not find tasks', HttpStatus.NOT_FOUND);
  }
}
