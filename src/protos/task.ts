/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "task";

export interface TaskId {
  id: number;
}

export interface TaskFields {
  title: string;
  userId: number;
  statusId: string;
}

export interface NewTask {
  title: string;
  description: string;
  statusId: string;
  assignUserId: number;
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
  backgroundHexColor: string;
  textHexColor: string;
}

export interface GRPCStatusList {
  statusList: GRPCStatus[];
}

export interface GRPCUser {
  id: number;
  fullname: string;
  email: string;
  avatar: string;
}

export interface Empty {
}

export const TASK_PACKAGE_NAME = "task";

export interface TaskGRPCServiceClient {
  findOne(request: TaskId): Observable<GRPCTask>;

  findMany(request: TaskFields): Observable<GRPCTaskList>;

  findAllStatus(request: Empty): Observable<GRPCStatusList>;

  createTask(request: NewTask): Observable<TaskId>;
}

export interface TaskGRPCServiceController {
  findOne(request: TaskId): Promise<GRPCTask> | Observable<GRPCTask> | GRPCTask;

  findMany(request: TaskFields): Promise<GRPCTaskList> | Observable<GRPCTaskList> | GRPCTaskList;

  findAllStatus(request: Empty): Promise<GRPCStatusList> | Observable<GRPCStatusList> | GRPCStatusList;

  createTask(request: NewTask): Promise<TaskId> | Observable<TaskId> | TaskId;
}

export function TaskGRPCServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne", "findMany", "findAllStatus", "createTask"];
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
