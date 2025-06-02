import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
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

@Module({
  imports: [
    ConfigurationModule,
    DatabaseConnectionModule,
    MailingModule,
    SmsNepalModule,
    HashingModule,
    PermissionModule,
    RoleModule,
    UsersModule,
    RedisModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
