import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import TaskEntity from './entities/task.entity';

describe('TaskController', () => {
  let controller: TaskController;

  const TASK_REPOSITORY_TOKEN = getRepositoryToken(TaskEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
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

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
