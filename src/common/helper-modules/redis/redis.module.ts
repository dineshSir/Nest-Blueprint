import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RefreshTokenIdsStorage } from './redis-refresh-token.service';
import { redisConfig } from 'src/configurations/redis.config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [RefreshTokenIdsStorage],
  exports: [RefreshTokenIdsStorage],
})
export class RedisModule {}
