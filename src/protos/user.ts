/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface Users {
  users: User[];
}

export interface Empty {
}

export interface RegisterDto {
  fullname: string;
  email: string;
  password: string;
}

export interface UserCreadentials {
  email: string;
  password: string;
}

export interface UserId {
  id: number;
}

export interface UserEmail {
  email: string;
}

export interface User {
  id: number;
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

  findByCredentials(request: UserCreadentials): Observable<User>;

  findMany(request: Empty): Observable<Users>;

  create(request: RegisterDto): Observable<User>;
}

export interface UserGRPCServiceController {
  findOne(request: UserId): Promise<User> | Observable<User> | User;

  findByEmail(request: UserEmail): Promise<User> | Observable<User> | User;

  findByCredentials(request: UserCreadentials): Promise<User> | Observable<User> | User;

  findMany(request: Empty): Promise<Users> | Observable<Users> | Users;

  create(request: RegisterDto): Promise<User> | Observable<User> | User;
}

export function UserGRPCServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne", "findByEmail", "findByCredentials", "findMany", "create"];
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
