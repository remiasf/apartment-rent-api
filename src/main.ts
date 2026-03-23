import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma-client-exception/prisma-client-exception-filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new PrismaExceptionFilter(httpAdapter));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('GaijinPot API') // Красивое название твоего проекта
    .setDescription('Документация для API аренды квартир')
    .setVersion('1.0')
    .addBearerAuth() // <-- СУПЕР ВАЖНО! Говорим Сваггеру, что у нас есть JWT токены
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  // 'api' — это URL, по которому будет доступна документация
  SwaggerModule.setup('api', app, document); 
  // =========================

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
