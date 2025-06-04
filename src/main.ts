import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: '*',
  });

  const configService = app.get<ConfigService>(ConfigService);
  const environment: string =
    configService.get<string>('APP_ENV') || 'development';
  if (environment.toUpperCase() !== 'PRODUCTION') {
    const swaggerDocumentInstance = new DocumentBuilder()
      .setTitle('Title for the documentation.')
      .setDescription('Description for the documentation.')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, swaggerDocumentInstance);
    SwaggerModule.setup('swagger', app, documentFactory, {
      customSiteTitle: 'Site Title - Browser Tab',
    });
  }

  await app.listen(configService.get('APP_PORT') ?? 3000);
}
bootstrap();
