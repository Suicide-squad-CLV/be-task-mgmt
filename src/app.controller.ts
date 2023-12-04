import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  @Get('database-info')
  getDatabaseInfo(): string {
    const dbNm = this.configService.get('DATABASE_NAME');
    const dbUsr = this.configService.get('DATABASE_USERNAME');
    const dbPrt = this.configService.get('DATABASE_PORT');
    const dbPwd = this.configService.get('DATABASE_PASSWORD');
    return `DB Name: ${dbNm} - DB User: ${dbUsr} - DB Port: ${dbPrt} - DB PWD: ${dbPwd}`;
  }
}
