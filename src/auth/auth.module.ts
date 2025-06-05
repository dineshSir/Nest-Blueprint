import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/modules/role/entities/role.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { AccessTokenGuard } from './guards/access-token.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication.guard';
import { PermissionGuard } from './guards/permissions.guard';
import { jwtConfig } from 'src/configurations/jwt.config';
import { redisConfig } from 'src/configurations/redis.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(redisConfig),
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
    // { provide: APP_GUARD, useClass: RolesGuard }, //for Roles Guard
    AccessTokenGuard,
    AuthenticationGuard,
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class AuthModule {}
