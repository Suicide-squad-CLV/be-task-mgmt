/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface Users {
  users: User[];
}

export interface RegisterDto {
  fullname: string;
  email: string;
  password: string;
}

export interface FindUserInfo {
  fullname: string;
  email: string;
}

export interface UserId {
  id: string;
}

export interface UserEmail {
  email: string;
}

export interface User {
  id: string;
  fullname: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const USER_PACKAGE_NAME = "user";

export interface UserGRPCServiceClient {
  findOne(request: UserId): Observable<User>;

  findByEmail(request: UserEmail): Observable<User>;

  findMany(request: FindUserInfo): Observable<Users>;

  create(request: RegisterDto): Observable<User>;
}

export interface UserGRPCServiceController {
  findOne(request: UserId): Promise<User> | Observable<User> | User;

  findByEmail(request: UserEmail): Promise<User> | Observable<User> | User;

  findMany(request: FindUserInfo): Promise<Users> | Observable<Users> | Users;

  create(request: RegisterDto): Promise<User> | Observable<User> | User;
}

export function UserGRPCServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne", "findByEmail", "findMany", "create"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserGRPCService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserGRPCService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_GR_PC_SERVICE_NAME = "UserGRPCService";
