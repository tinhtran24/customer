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
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ProductModule } from "./products/product.module";
import { AppoinmentModule } from './appointment/appoinment.module';
import { TaskModule } from './task/task.module';
import { CustomerProductModule } from './customer-product/customer-product.module';
import { NoteModule } from './note/note.module';
import { SettingModule } from './setting/setting.module';
import { CustomThrottlerGuard } from "./core/guards/throttler-behind-proxy.guard";

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
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        errorMessage: 'Thao tác quá nhanh, hãy thử lại',
        throttlers: [{ ttl: seconds(10), limit: 100 }],
       }),
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
    NoteModule,
    SettingModule
  ],

  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: CustomThrottlerGuard },
  ],
})
export class AppModule {}
