import StatusEntity from '../../modules/task/entities/status.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class TaskStatusSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(StatusEntity);
    const statuses = ['Todo', 'In Progress', 'Done', 'Archived'];
    const data: Partial<StatusEntity>[] = [];

    statuses.forEach((status) => {
      data.push({
        statusName: status,
      });
    });

    const newUserPromises = data.map(async (statusData) =>
      userRepository.create(statusData),
    );
    const newUsers = await Promise.all(newUserPromises);

    await userRepository.save(newUsers);
  }
}
