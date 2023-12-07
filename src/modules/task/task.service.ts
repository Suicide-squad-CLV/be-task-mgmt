import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import TaskEntity from './entities/task.entity';
import { Repository } from 'typeorm';
import { FindTaskInfo, Task, TaskList } from 'src/protos/task';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  async getAll(request: FindTaskInfo): Promise<TaskList> {
    console.log(request);

    // Define condition for where clause based on FindTaskInfro value
    const condition: any = {};
    if (request.title) {
      condition.taskTitle = request.title;
    }
    const userRelation = request.assignUserName != null;
    if (userRelation) {
      condition.user.fullname = request.assignUserName;
    }

    // Get tasks based on condition
    const tasks = await this.taskRepository.find({
      relations: { user: userRelation },
      where: condition,
    });

    // Mock data to test
    // const tasks: TaskEntity[] = [
    //   new TaskEntity({
    //     id: 1,
    //     taskTitle: 'Task 1',
    //     taskDescription: 'Task 1 Description',
    //     isDeleted: false,
    //   }),
    //   new TaskEntity({
    //     id: 2,
    //     taskTitle: 'Task 2',
    //     taskDescription: 'Task 2 Description',
    //     isDeleted: false,
    //   }),
    // ];

    if (tasks) {
      // Map TaskEntity to Task in GRPC Return
      const result: Task[] = tasks.map((task: TaskEntity) => task.toGRPCTask());
      return { tasks: result };
    }

    // Throw error if there is no task
    throw new HttpException('Can not find tasks', HttpStatus.NOT_FOUND);
  }
}
