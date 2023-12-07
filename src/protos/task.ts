/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "task";

export interface FindTaskId {
  id: number;
}

export interface FindTaskInfo {
  title: string;
  assignUserName: string;
}

export interface Task {
  id: number;
  taskTitle: string;
  taskDescription: string;
  isDeleted: boolean;
  assignUserId: string;
}

export interface TaskList {
  tasks: Task[];
}

export const TASK_PACKAGE_NAME = "task";

export interface TaskGRPCServiceClient {
  findOne(request: FindTaskId): Observable<Task>;

  findMany(request: FindTaskInfo): Observable<TaskList>;
}

export interface TaskGRPCServiceController {
  findOne(request: FindTaskId): Promise<Task> | Observable<Task> | Task;

  findMany(request: FindTaskInfo): Promise<TaskList> | Observable<TaskList> | TaskList;
}

export function TaskGRPCServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne", "findMany"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("TaskGRPCService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("TaskGRPCService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TASK_GR_PC_SERVICE_NAME = "TaskGRPCService";
