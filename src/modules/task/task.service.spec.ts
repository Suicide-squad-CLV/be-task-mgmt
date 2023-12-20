import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import TaskEntity from './entities/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { GRPCStatus, GRPCStatusList, GRPCTask, NewTask } from 'src/protos/task';
import StatusEntity from './entities/status.entity';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepo: Repository<TaskEntity>;
  let statusRepo: Repository<StatusEntity>;

  const TASK_REPOSITORY_TOKEN = getRepositoryToken(TaskEntity);
  const STATUS_REPOSITORY_TOKEN = getRepositoryToken(StatusEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: STATUS_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepo = module.get<Repository<TaskEntity>>(TASK_REPOSITORY_TOKEN);
    statusRepo = module.get<Repository<StatusEntity>>(STATUS_REPOSITORY_TOKEN);
  });

  it('TaskService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('TaskRepository should be defined', () => {
    expect(taskRepo).toBeDefined();
  });

  it('StatusRepository should be defined', () => {
    expect(statusRepo).toBeDefined();
  });

  describe('feature/query-all-tasks: Query all tasks feature', () => {
    it('should be able to return tasks having the task title keywords', async () => {
      const params = {
        title: 'Task',
      };
      // Define condition for where clause based on FindTaskInfro value
      const condition: any = {};
      condition.taskTitle = params.title;

      // Get tasks based on condition
      const tasks = await taskRepo.find({
        relations: {
          status: true,
          user: true,
        },
        where: [
          {
            taskTitle: ILike(`%${params.title ?? ''}%`),
          },
          {
            taskDescription: ILike(`%${params.title ?? ''}%`),
          },
        ],
        order: {
          status: {
            createdAt: 'ASC',
          },
        },
      });
      if (tasks) {
        // Map TaskEntity to Task in GRPC Return
        const result: GRPCTask[] = tasks.map((task: TaskEntity) =>
          task.toGRPCTask(),
        );
        expect({ tasks: result }).toEqual(service.getAllTasks(params));
      }
    });

    it('should be able to return tasks having the user id', async () => {
      const params = {
        userId: 3,
      };
      // Define condition for where clause based on FindTaskInfro value
      const condition: any = { user: {} };
      condition.user.id = params.userId;

      // Get tasks based on condition
      const tasks = await taskRepo.find({
        relations: {
          status: true,
          user: true,
        },
        where: condition,
        order: {
          status: {
            createdAt: 'ASC',
          },
        },
      });
      if (tasks) {
        // Map TaskEntity to Task in GRPC Return
        const result: GRPCTask[] = tasks.map((task: TaskEntity) =>
          task.toGRPCTask(),
        );
        expect({ tasks: result }).toEqual(service.getAllTasks(params));
      }
    });

    it('should be able to return tasks having the status id', async () => {
      const params = {
        statusId: '0df1c5c2-eae1-4378-a2d6-22f4979b4cf1',
      };
      // Define condition for where clause based on FindTaskInfro value
      const condition: any = { status: {} };
      condition.status.id = params.statusId;

      // Get tasks based on condition
      const tasks = await taskRepo.find({
        relations: {
          status: true,
          user: true,
        },
        where: condition,
        order: {
          status: {
            createdAt: 'ASC',
          },
        },
      });
      if (tasks) {
        // Map TaskEntity to Task in GRPC Return
        const result: GRPCTask[] = tasks.map((task: TaskEntity) =>
          task.toGRPCTask(),
        );
        expect({ tasks: result }).toEqual(service.getAllTasks(params));
      }
    });

    it('should be able to return all tasks in case empty parameters', async () => {
      // Define condition for where clause based on FindTaskInfro value
      const condition: any = {};

      // Get tasks based on condition
      const tasks = await taskRepo.find({
        relations: {
          status: true,
          user: true,
        },
        where: condition,
        order: {
          status: {
            createdAt: 'ASC',
          },
        },
      });
      if (tasks) {
        // Map TaskEntity to Task in GRPC Return
        const result: GRPCTask[] = tasks.map((task: TaskEntity) =>
          task.toGRPCTask(),
        );
        expect({ tasks: result }).toEqual(service.getAllTasks({} as any));
      }
    });
  });

  describe('feature/query-a-task: Query a task by id feature', () => {
    it('should be able to return a task having the same id', async () => {
      const params = {
        id: 1,
      };

      const task = await taskRepo.findOne({
        relations: {
          status: true,
          user: true,
        },
        where: {
          id: params.id,
          isDeleted: false,
        },
      });
      if (task) {
        const result: GRPCTask = task.toGRPCTask();
        expect(result).toEqual(service.getTask(params));
      }
    });
  });

  describe('feature/query-all-status: Query all status', () => {
    it('should be able to return all task status', async () => {
      const payload = {};
      const condition: any = {
        isDeleted: false,
        ...payload,
      };
      const statusList = await statusRepo.find({
        where: condition,
        order: {
          createdAt: 'ASC',
        },
      });
      if (statusList) {
        const result: GRPCStatus[] = statusList.map((status: StatusEntity) =>
          status.toGRPCStatus(),
        );
        expect({ statusList: result }).toEqual(service.getAllStatus(payload));
      }
    });
  });

  describe('feature/create-a-task: Create a task', () => {
    it('should be able to return a task id', async () => {
      const list: GRPCStatusList = await service.getAllStatus({});

      const payload: Partial<NewTask> = {
        title: 'New task',
        description: 'New Description',
        statusId: list.statusList?.[0].id,
      };

      const insert = await taskRepo
        .createQueryBuilder()
        .insert()
        .into(TaskEntity)
        .values([
          {
            taskTitle: payload.title,
            taskDescription: payload.description,
            user: {
              id: payload.assignUserId,
            },
            status: {
              id: payload.statusId,
            },
          },
        ])
        .returning('*')
        .execute();

      if (insert.generatedMaps.length > 0) {
        // Return task data
        const returnData = insert.generatedMaps[0];

        const task = new TaskEntity(returnData);
        expect({ id: task.id }).toEqual(service.createTask(payload));
      }
    });
  });
});
