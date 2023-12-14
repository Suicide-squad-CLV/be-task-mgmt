import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  TaskId,
  TaskFields,
  GRPCTask,
  GRPCTaskList,
  TaskGRPCServiceController,
  TaskGRPCServiceControllerMethods,
  Empty,
  GRPCStatusList,
  NewTask,
  UpdatedTask,
} from 'src/protos/task';
import { TaskService } from './task.service';
import { Observable } from 'rxjs';

@Controller('task')
@ApiTags('Task')
@TaskGRPCServiceControllerMethods()
export class TaskController implements TaskGRPCServiceController {
  constructor(private readonly taskService: TaskService) {}

  findAllStatus(
    payload: Empty,
  ): GRPCStatusList | Promise<GRPCStatusList> | Observable<GRPCStatusList> {
    return this.taskService.getAllStatus(payload);
  }

  findMany(
    payload: TaskFields,
  ): Promise<GRPCTaskList> | Observable<GRPCTaskList> | GRPCTaskList {
    return this.taskService.getAllTasks(payload);
  }

  findOne(
    payload: TaskId,
  ): GRPCTask | Observable<GRPCTask> | Promise<GRPCTask> {
    return this.taskService.getTask(payload);
  }

  createTask(payload: NewTask): TaskId | Promise<TaskId> | Observable<TaskId> {
    return this.taskService.createTask(payload);
  }

  updateTask(
    payload: UpdatedTask,
  ): TaskId | Promise<TaskId> | Observable<TaskId> {
    return this.taskService.updateTask(payload);
  }
}
