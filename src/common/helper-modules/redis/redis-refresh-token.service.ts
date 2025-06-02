import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Redis from 'ioredis';
import redisConfig from 'src/configurations/redis.config';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    @Inject(redisConfig.KEY)
    private readonly redisConfiguration: ConfigType<typeof redisConfig>,
  ) {}
  private redishClient: Redis;
  onApplicationBootstrap() {
    this.redishClient = new Redis({
      host: this.redisConfiguration.host,
      port: this.redisConfiguration.port,
    });
  }

  onApplicationShutdown(signal?: string) {
    return this.redishClient.quit();
  }

  async insert(userId: number, tokenId: string) {
    const stored = await this.redishClient.set(this.getKey(userId), tokenId);
    return stored;
  }

  async validate(userId: number, tokenId: string) {
    const storedId = await this.redishClient.get(this.getKey(userId));
    if (storedId !== tokenId) throw new InvalidatedRefreshTokenError();
    return storedId === tokenId;
  }

  async invalidate(userId: number) {
    await this.redishClient.del(this.getKey(userId));
  }

  private getKey(userId: number) {
    return `user-${userId}`;
  }
}
