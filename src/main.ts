import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('User Management Sample')
    .setDescription('Simple User Management API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Open server port
  const port = configService.get('PORT');
  await app.listen(port || 3000, () => {
    console.log(`Application is running in port ${port}`);
  });
}
bootstrap();
