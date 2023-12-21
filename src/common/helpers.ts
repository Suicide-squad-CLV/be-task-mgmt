import StatusEntity from 'src/modules/task/entities/status.entity';
import TaskEntity from 'src/modules/task/entities/task.entity';
import { GRPCTask } from 'src/protos/task';

export const convertTaskEntityToGRPC = (task: TaskEntity) => {
  // Map TaskEntity to GRPCTask
  const grpcTask: GRPCTask = {
    id: task.id,
    taskTitle: task.taskTitle,
    taskDescription: task.taskDescription ?? '',
    assignUser: task.user,
    status: task.status,
  };
  return grpcTask;
};

export const convertStatusEntityToGRPC = (status: StatusEntity) => {
  // Map StatusEntity to GRPCStatus
  return {
    id: status.id,
    statusName: status.statusName,
    backgroundHexColor: status.backgroundHexColor,
    textHexColor: status.textHexColor,
  };
};
