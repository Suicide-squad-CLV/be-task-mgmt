import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  TaskGRPCServiceControllerMethods,
  FindTasks,
  TaskList,
  TaskGRPCServiceController,
  FindTaskId,
  Task,
} from 'src/protos/task';
import { TaskService } from './task.service';
import { Observable } from 'rxjs';

@Controller('task')
@ApiTags('Task')
@TaskGRPCServiceControllerMethods()
export class TaskController implements TaskGRPCServiceController {
  constructor(private readonly taskService: TaskService) {}

  findOne(request: FindTaskId): Task | Observable<Task> | Promise<Task> {
    console.log(request);
    throw new Error('Method not implemented.');
  }

  findMany(
    request: FindTasks,
  ): Promise<TaskList> | Observable<TaskList> | TaskList {
    console.log('request', request);
    return this.taskService.getAll(request);
  }
}
