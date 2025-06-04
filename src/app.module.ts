import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HashingModule } from './common/helper-modules/hashing/hashing.module';
import { MailingModule } from './common/helper-modules/mailing/mailing.module';
import { RedisModule } from './common/helper-modules/redis/redis.module';
import { SmsNepalModule } from './common/helper-modules/sms-nepal/sms.nepal.module';
import { ConfigurationModule } from './configurations/configuration.module';
import { DatabaseConnectionModule } from './database/database-connection.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { UsersModule } from './modules/users/users.module';
import { CloudinaryModule } from './common/helper-modules/cloudinary/cloudinary.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseConnectionModule,
    RedisModule,
    MailingModule,
    SmsNepalModule,
    CloudinaryModule,
    HashingModule,
    PermissionModule,
    RoleModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
    },
  ],
})
export class AppModule {}
