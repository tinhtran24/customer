import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesModule } from './roles/roles.module';
import { AddressesModule } from './addresses/addresses.module';
import { CustomersModule } from './customers/customers.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ProductModule } from "./products/product.module";
import { AppoinmentModule } from './appointment/appoinment.module';
import { TaskModule } from './task/task.module';
import { CustomerProductModule } from './customer-product/customer-product.module';
import { NoteModule } from './note/note.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    ThrottlerModule.forRoot({
      errorMessage: 'Thao tác quá nhanh, hãy thử lại',
      throttlers: [
        {
          name: 'short',
          ttl: 3000,
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 20,
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    DatabaseModule.forRoot(),
    UsersModule,
    AuthModule,
    RolesModule,
    AddressesModule,
    CustomersModule,
    ProductModule,
    AppoinmentModule,
    TaskModule,
    CustomerProductModule,
    NoteModule
  ],

  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
