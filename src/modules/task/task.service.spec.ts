import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import TaskEntity from './entities/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import StatusEntity from './entities/status.entity';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepo: Repository<TaskEntity>;
  let statusRepo: Repository<StatusEntity>;

  const TASK_REPOSITORY_TOKEN = getRepositoryToken(TaskEntity);
  const STATUS_REPOSITORY_TOKEN = getRepositoryToken(StatusEntity);
  const mockTaskEntityDataList = [
    {
      id: 1,
      taskTitle: 'title',
      taskDescription: 'desc',
      isDeleted: false,
      user: {
        id: 1,
        email: 'user-email',
      },
      status: {
        id: 1,
        name: 'status-name',
      },
    },
    {
      id: 1,
      taskTitle: 'title',
      taskDescription: 'desc',
      isDeleted: false,
      user: {
        id: 1,
        email: 'user-email',
      },
      status: {
        id: 1,
        name: 'status-name',
      },
    },
  ];

  const mockTaskEntityData = {
    id: 1,
    taskTitle: 'title',
    taskDescription: 'desc',
    isDeleted: false,
    user: {
      id: 1,
      email: 'user-email',
    },
    status: {
      id: 1,
      name: 'status-name',
    },
  };

  const mockStatusEntityDataList = [
    {
      backgroundHexColor: '#eef2fc',
      id: '7c9b5e69-99c6-4e09-95c1-0fcdea618637',
      statusName: 'To Do',
      textHexColor: '#14367B',
      isDeleted: false,
      task: [],
    },
    {
      backgroundHexColor: '#FFF6EB',
      id: 'eb11dd2d-73b0-41f8-b2ae-d359a48b0156',
      statusName: 'In Progress',
      textHexColor: '#8F4F00',
      isDeleted: false,
      task: [],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn().mockResolvedValue(mockTaskEntityDataList),
            findOne: jest.fn().mockResolvedValue(mockTaskEntityData),
          },
        },
        {
          provide: STATUS_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn().mockResolvedValue(mockStatusEntityDataList),
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
    it('should be able to return all tasks when match search conditions', async () => {
      const searchParams = {
        title: 'title',
        userId: 1,
        statusId: '1',
      };

      const expectedRes = {
        tasks: [
          {
            id: 1,
            taskTitle: 'title',
            taskDescription: 'desc',
            assignUser: {
              id: 1,
              email: 'user-email',
            },
            status: {
              id: 1,
              name: 'status-name',
            },
          },
          {
            id: 1,
            taskTitle: 'title',
            taskDescription: 'desc',
            assignUser: {
              id: 1,
              email: 'user-email',
            },
            status: {
              id: 1,
              name: 'status-name',
            },
          },
        ],
      };

      // Get tasks based on condition
      const tasksResult = await service.getAllTasks(searchParams);
      expect(tasksResult).toMatchObject(expectedRes);
    });

    it('should be throw error when can not find task list', async () => {
      const searchParams = {
        title: 'title',
        userId: 1,
        statusId: '1',
      };

      jest.spyOn(taskRepo, 'find').mockImplementationOnce(async () => []);

      // Get tasks based on condition
      expect(service.getAllTasks(searchParams)).rejects.toThrow(
        'Can not find tasks',
      );
    });
  });

  describe('feature/query-a-task: Query a task by id feature', () => {
    it('should be able to return a task having the same id', async () => {
      const searchParams = {
        id: 1,
      };
      jest.spyOn(taskRepo, 'findOne').mockImplementationOnce(async () => null);

      // Get tasks based on condition
      expect(service.getTask(searchParams)).rejects.toThrow(
        'Can not find task',
      );
    });

    it('should be able to return a task having the same id', async () => {
      const searchParams = {
        id: 1,
      };

      const expectedResult = {
        id: 1,
        taskTitle: 'title',
        taskDescription: 'desc',
        assignUser: {
          id: 1,
          email: 'user-email',
        },
        status: {
          id: 1,
          name: 'status-name',
        },
      };

      const result = await service.getTask(searchParams);

      // Get tasks based on condition
      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('feature/query-all-status: Query all status', () => {
    it('should be able to return all task status', async () => {
      const payload: any = {
        isDeleted: false,
      };

      const expectedResult = {
        statusList: [
          {
            backgroundHexColor: '#eef2fc',
            id: '7c9b5e69-99c6-4e09-95c1-0fcdea618637',
            statusName: 'To Do',
            textHexColor: '#14367B',
          },
          {
            backgroundHexColor: '#FFF6EB',
            id: 'eb11dd2d-73b0-41f8-b2ae-d359a48b0156',
            statusName: 'In Progress',
            textHexColor: '#8F4F00',
          },
        ],
      };

      const results = await service.getAllStatus(payload);
      expect(results).toMatchObject(expectedResult);
    });
  });

  // describe('feature/create-a-task: Create a task', () => {
  //   it('should be able to return a task id', async () => {
  //     const list: GRPCStatusList = await service.getAllStatus({});

  //     const payload: Partial<NewTask> = {
  //       title: 'New task',
  //       description: 'New Description',
  //       statusId: list.statusList?.[0].id,
  //     };

  //     const insert = await taskRepo
  //       .createQueryBuilder()
  //       .insert()
  //       .into(TaskEntity)
  //       .values([
  //         {
  //           taskTitle: payload.title,
  //           taskDescription: payload.description,
  //           user: {
  //             id: payload.assignUserId,
  //           },
  //           status: {
  //             id: payload.statusId,
  //           },
  //         },
  //       ])
  //       .returning('*')
  //       .execute();

  //     if (insert.generatedMaps.length > 0) {
  //       // Return task data
  //       const returnData = insert.generatedMaps[0];

  //       const task = new TaskEntity(returnData);
  //       expect({ id: task.id }).toEqual(service.createTask(payload));
  //     }
  //   });
  // });
});
