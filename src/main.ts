import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { envKeys } from './config/config.keys';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const configService = app.get(ConfigService);
  const swaggerConfigEnabled = configService.get<boolean>(
    envKeys.SWAGGER_ENABLED,
    false,
  );

  if (swaggerConfigEnabled) {
    const config = new DocumentBuilder()
      .setTitle('Jeffrey Logis V1 API')
      .setDescription('Dev API for Jeffrey Logis')
      .setVersion('V1')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs-ui', app, document);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  app.enableCors();

  await app.listen(8080);
}
bootstrap();
