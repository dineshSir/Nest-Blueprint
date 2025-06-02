import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import redisConfig from 'src/configurations/redis.config';
import { RefreshTokenIdsStorage } from './redis-refresh-token.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [RefreshTokenIdsStorage],
  exports: [RefreshTokenIdsStorage],
})
export class RedisModule {}
