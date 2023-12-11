/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "task";

export interface TaskId {
  id: number;
}

export interface TaskFields {
  title: string;
  userId: string;
  statusId: string;
}

export interface GRPCTask {
  id: number;
  taskTitle: string;
  taskDescription: string;
  assignUser: GRPCUser | undefined;
  status: GRPCStatus | undefined;
}

export interface GRPCTaskList {
  tasks: GRPCTask[];
}

export interface GRPCStatus {
  id: string;
  statusName: string;
}

export interface GRPCUser {
  id: number;
  fullname: string;
  email: string;
  avatar: string;
  refreshToken: string;
}

export interface Empty {
}

export const TASK_PACKAGE_NAME = "task";

export interface TaskGRPCServiceClient {
  findOne(request: TaskId): Observable<GRPCTask>;

  findMany(request: TaskFields): Observable<GRPCTaskList>;
}

export interface TaskGRPCServiceController {
  findOne(request: TaskId): Promise<GRPCTask> | Observable<GRPCTask> | GRPCTask;

  findMany(request: TaskFields): Promise<GRPCTaskList> | Observable<GRPCTaskList> | GRPCTaskList;
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
