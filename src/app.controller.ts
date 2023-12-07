import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Home')
@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  @Get('database-info')
  getDatabaseInfo(): any {
    const dbNm = this.configService.get('DATABASE_NAME');
    const dbUsr = this.configService.get('DATABASE_USERNAME');
    const dbPrt = this.configService.get('DATABASE_PORT');
    const dbPwd = this.configService.get('DATABASE_PASSWORD');
    const dbHost = this.configService.get('DATABASE_HOST');

    return {
      database_name: dbNm,
      database_host: dbHost,
      database_port: dbPrt,
      database_username: dbUsr,
      database_password: dbPwd,
    };
  }
}
