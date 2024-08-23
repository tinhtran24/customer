import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { delay } from 'src/middleware/delay.middleware';
import helmet from 'helmet';
import { useSwagger } from "./app.swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(delay);
  app.use(helmet());
  useSwagger(app);

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
