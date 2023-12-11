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
} from 'src/protos/task';
import { TaskService } from './task.service';
import { Observable } from 'rxjs';

@Controller('task')
@ApiTags('Task')
@TaskGRPCServiceControllerMethods()
export class TaskController implements TaskGRPCServiceController {
  constructor(private readonly taskService: TaskService) {}

  findAllStatus(
    request: Empty,
  ): GRPCStatusList | Promise<GRPCStatusList> | Observable<GRPCStatusList> {
    return this.taskService.getAllStatus(request);
  }

  findOne(
    request: TaskId,
  ): GRPCTask | Observable<GRPCTask> | Promise<GRPCTask> {
    console.log(request);
    throw new Error('Method not implemented.');
  }

  findMany(
    request: TaskFields,
  ): Promise<GRPCTaskList> | Observable<GRPCTaskList> | GRPCTaskList {
    return this.taskService.getAllTasks(request);
  }
}
