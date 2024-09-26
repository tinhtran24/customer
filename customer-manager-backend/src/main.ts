import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { delay } from 'src/middleware/delay.middleware';
import helmet from 'helmet';
import { useSwagger } from "./app.swagger";
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
      cors({
          origin: true,
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          credentials: true,
      }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(helmet());
  useSwagger(app);

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
