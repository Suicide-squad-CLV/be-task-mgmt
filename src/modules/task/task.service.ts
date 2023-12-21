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
  UpdatedTask,
} from 'src/protos/task';
import StatusEntity from './entities/status.entity';
import {
  convertStatusEntityToGRPC,
  convertTaskEntityToGRPC,
} from 'src/common/helpers';

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
        convertStatusEntityToGRPC(status),
      );
      return { statusList: result };
    }

    // Throw error if there is no task
    throw new HttpException('Can not find tasks', HttpStatus.NOT_FOUND);
  }

  async getAllTasks(payload: Partial<TaskFields>): Promise<GRPCTaskList> {
    // Define condition for where clause based on payload value
    const commonCon: any = {
      isDeleted: false,
      user: {},
      status: {},
    };
    if (payload.userId) {
      commonCon.user.id = payload.userId;
    }
    if (payload.statusId) {
      commonCon.status.id = payload.statusId;
    }

    // Query all tasks that satisfy the condition
    const tasks = await this.taskRepository.find({
      relations: {
        status: true,
        user: true,
      },
      where: [
        {
          ...commonCon,
          taskTitle: ILike(`%${payload.title ?? ''}%`),
        },
        {
          ...commonCon,
          taskDescription: ILike(`%${payload.title ?? ''}%`),
        },
      ],
      order: {
        status: {
          createdAt: 'ASC',
        },
      },
    });

    if (tasks.length > 0) {
      // Map TaskEntity to GRPCTask
      const result: GRPCTask[] = tasks.map((task: TaskEntity) =>
        convertTaskEntityToGRPC(task),
      );
      return { tasks: result };
    } else {
      // Throw error if there is no task
      throw new HttpException('Can not find tasks', HttpStatus.NOT_FOUND);
    }
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
      return convertTaskEntityToGRPC(task);
    }

    // Throw error if there is no task
    throw new HttpException('Can not find a task', HttpStatus.NOT_FOUND);
  }

  async createTask(payload: Partial<NewTask>): Promise<TaskId> {
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

  async updateTask(payload: UpdatedTask): Promise<TaskId> {
    console.log(payload);
    const updatedData: any = {};

    if (payload.title) {
      updatedData.taskTitle = payload.title;
    }
    if (payload.description) {
      updatedData.taskDescription = payload.description;
    }
    if (payload.statusId) {
      updatedData.status = {
        id: payload.statusId,
      };
    }
    if (payload.assignUserId) {
      updatedData.user = {
        id: payload.assignUserId,
      };
    }
    if (payload.deleteFlag) {
      const isPersisted = await this.taskRepository.findOne({
        select: {
          status: {
            persisted: true,
          },
        },
        relations: {
          status: true,
        },
        where: {
          id: payload.taskId,
          isDeleted: false,
        },
      });
      if (!isPersisted) {
        updatedData.isDeleted = payload.deleteFlag;
      }
    }

    console.log(updatedData);

    const update = await this.taskRepository
      .createQueryBuilder()
      .update(TaskEntity)
      .set(updatedData)
      .where('id = :id', { id: payload.taskId })
      .returning('*')
      .execute();

    console.log(update);
    if (update.raw.length > 0) {
      // Return task data
      const returnData = update.raw[0];
      // returnData.user = {};
      // returnData.status = {};
      const task = new TaskEntity(returnData);
      return { id: task.id };
    }

    // Throw error if there is no task
    throw new HttpException('Can not update a task', HttpStatus.NOT_FOUND);
  }
}
