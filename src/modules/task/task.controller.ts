import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('task')
@ApiTags('Task')
export class TaskController {
  login() {}
}
