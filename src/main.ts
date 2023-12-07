import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import 'reflect-metadata';
import { USER_PACKAGE_NAME } from './protos/user';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  // Microservice configuration
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: [USER_PACKAGE_NAME],
      protoPath: [join(__dirname, '../src/protos/user.proto')],
      url: configService.get<string>('APP_GRPC_URL'),
    },
  });

  await app.startAllMicroservices();

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Tasks Management Sample')
    .setDescription('Simple Task Management API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.setGlobalPrefix('api');

  const port = configService.get('PORT');
  await app.listen(port || 5000, () => {
    console.log(`BE is running in port ${port}`);
  });
}
bootstrap();
