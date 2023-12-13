import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import TaskEntity from './entities/task.entity';
import { ILike, Repository } from 'typeorm';
import {
  TaskFields,
  GRPCTask,
  GRPCTaskList,
  Empty,
  GRPCStatusList,
  GRPCStatus,
  TaskId,
  NewTask,
} from 'src/protos/task';
import StatusEntity from './entities/status.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    @InjectRepository(StatusEntity)
    private statusRepository: Repository<StatusEntity>,
  ) {}

  async getAllStatus(payload: Empty): Promise<GRPCStatusList> {
    const condition: any = {
      isDeleted: false,
      ...payload,
    };
    const statusList = await this.statusRepository.find({
      where: condition,
      order: {
        createdAt: 'ASC',
      },
    });

    if (statusList) {
      // Map TaskEntity to GRPCTask
      const result: GRPCStatus[] = statusList.map((status: StatusEntity) =>
        status.toGRPCStatus(),
      );
      return { statusList: result };
    }

    // Throw error if there is no task
    throw new HttpException('Can not find tasks', HttpStatus.NOT_FOUND);
  }

  async getAllTasks(payload: TaskFields): Promise<GRPCTaskList> {
    // Define condition for where clause based on payload value
    const condition: any = {
      isDeleted: false,
      user: {},
      status: {},
    };
    if (payload.title) {
      condition.taskTitle = ILike(`%${payload.title}%`);
    }
    if (payload.userId) {
      condition.user.id = payload.userId;
    }
    if (payload.statusId) {
      condition.status.id = payload.statusId;
    }

    // Query all tasks that satisfy the condition
    const tasks = await this.taskRepository.find({
      relations: {
        status: true,
        user: true,
      },
      where: condition,
      order: {
        status: {
          createdAt: 'ASC',
        },
      },
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

  async getTask(payload: TaskId): Promise<GRPCTask> {
    const task = await this.taskRepository.findOne({
      relations: {
        status: true,
        user: true,
      },
      where: {
        id: payload.id,
        isDeleted: false,
      },
    });

    if (task) {
      // Map TaskEntity to GRPCTask
      return task.toGRPCTask();
    }

    // Throw error if there is no task
    throw new HttpException('Can not find task', HttpStatus.NOT_FOUND);
  }

  async createTask(payload: NewTask): Promise<TaskId> {
    const insert = await this.taskRepository
      .createQueryBuilder()
      .insert()
      .into(TaskEntity)
      .values([
        {
          taskTitle: payload.title,
          taskDescription: payload.description,
          user: {
            id: payload.assignUserId,
          },
          status: {
            id: payload.statusId,
          },
        },
      ])
      .returning('*')
      .execute();

    if (insert.generatedMaps.length > 0) {
      // Return task data
      const returnData = insert.generatedMaps[0];
      // returnData.user = {};
      // returnData.status = {};
      const task = new TaskEntity(returnData);
      return { id: task.id };
    }

    // Throw error if there is no task
    throw new HttpException('Can not create a task', HttpStatus.NOT_FOUND);
  }
}
