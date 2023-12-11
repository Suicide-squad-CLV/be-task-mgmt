import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import TaskEntity from './entities/task.entity';
import { ILike, Repository } from 'typeorm';
import { TaskFields, GRPCTask, GRPCTaskList } from 'src/protos/task';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  async getAllTasks(request: TaskFields): Promise<GRPCTaskList> {
    // Define condition for where clause based on request value
    const condition: any = {
      isDeleted: false,
      user: {},
      status: {},
    };
    if (request.title) {
      condition.taskTitle = ILike(`%${request.title}%`);
    }
    if (request.userId) {
      condition.user.id = request.userId;
    }
    if (request.statusId) {
      condition.status.id = request.statusId;
    }

    // Query all tasks that satisfy the condition
    const tasks = await this.taskRepository.find({
      relations: {
        status: true,
        user: true,
      },
      where: condition,
    });

    if (tasks) {
      // Map TaskEntity to GRPCTask
      const result: GRPCTask[] = tasks.map((task: TaskEntity) =>
        task.toGRPCTask(),
      );
      return { tasks: result };
    }

    // Throw error if there is no task
    throw new HttpException('Can not find tasks', HttpStatus.NOT_FOUND);
  }
}
