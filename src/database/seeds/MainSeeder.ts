import { DataSource } from 'typeorm'
import { runSeeder, Seeder } from 'typeorm-extension'
import { TaskStatusSeeder } from './StatusSeeder'

export class MainSeeder implements Seeder {
	async run(dataSource: DataSource): Promise<void> {
		await runSeeder(dataSource, TaskStatusSeeder)
	}
}