import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import TaskEntity from './entities/task.entity';
import { Repository } from 'typeorm';
import StatusEntity from './entities/status.entity';

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
            findAllStatus: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(StatusEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
