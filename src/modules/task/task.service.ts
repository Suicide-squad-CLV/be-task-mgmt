import { Injectable } from '@nestjs/common';
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
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

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
      // Map StatusEntity to GRPCStatus
      const result: GRPCStatus[] = statusList.map((status: StatusEntity) =>
        convertStatusEntityToGRPC(status),
      );
      return { statusList: result };
    }

    // Throw error if there is no status
    throw new RpcException({
      details: 'Can not find status list',
      code: status.UNAVAILABLE,
    });
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
        updatedAt: 'DESC',
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
    }

    // Throw error if there is no task
    throw new RpcException({
      details: 'Can not find tasks',
      code: status.INVALID_ARGUMENT,
    });
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
    throw new RpcException({
      message: 'Can not find a task',
      code: status.INVALID_ARGUMENT,
    });
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

    // Throw error if there is no created task
    throw new RpcException({
      details: 'Can not create a task',
      code: status.INVALID_ARGUMENT,
    });
  }

  async updateTask(payload: UpdatedTask): Promise<TaskId> {
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
    if (payload.deleteFlag !== undefined) {
      const task = await this.taskRepository.findOne({
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
      if (!task?.status?.persisted) {
        updatedData.isDeleted = payload.deleteFlag;
      }
    }

    const update = await this.taskRepository
      .createQueryBuilder()
      .update(TaskEntity)
      .set(updatedData)
      .where('id = :id', { id: payload.taskId })
      .returning('*')
      .execute();

    if (update.raw.length > 0) {
      // Return task data
      const returnData = update.raw[0];
      // returnData.user = {};
      // returnData.status = {};
      const task = new TaskEntity(returnData);
      return { id: task.id };
    }

    // Throw error if there is no updated task
    throw new RpcException({
      details: 'Can not update a task',
      code: status.INVALID_ARGUMENT,
    });
  }
}
