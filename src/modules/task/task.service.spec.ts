import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import TaskEntity from './entities/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from 'src/protos/task';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepo: Repository<TaskEntity>;

  const TASK_REPOSITORY_TOKEN = getRepositoryToken(TaskEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepo = module.get<Repository<TaskEntity>>(TASK_REPOSITORY_TOKEN);
  });

  it('TaskService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('TaskRepository should be defined', () => {
    expect(taskRepo).toBeDefined();
  });

  describe('feature/query-all-tasks: Query all tasks feature', () => {
    it('should be able to return tasks having the task title keywords', async () => {
      const taskTitle = 'Test';
      // Define condition for where clause based on FindTaskInfro value
      const condition: any = {};
      condition.taskTitle = taskTitle;

      // Get tasks based on condition
      const tasks = await taskRepo.find(condition);
      if (tasks) {
        // Map TaskEntity to Task in GRPC Return
        const result: Task[] = tasks.map((task: TaskEntity) =>
          task.toGRPCTask(),
        );
        expect({ tasks: result }).toEqual(service.getAll({ title: taskTitle }));
      }
    });

    it('should be able to return all tasks in case empty parameters', async () => {
      // Define condition for where clause based on FindTaskInfro value
      const condition: any = {};

      // Get tasks based on condition
      const tasks = await taskRepo.find(condition);
      if (tasks) {
        // Map TaskEntity to Task in GRPC Return
        const result: Task[] = tasks.map((task: TaskEntity) =>
          task.toGRPCTask(),
        );
        expect({ tasks: result }).toEqual(service.getAll({} as any));
      }
    });
  });
});
