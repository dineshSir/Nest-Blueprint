import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../configurations/database.config';

@Module({
  imports: [TypeOrmModule.forRootAsync(databaseConfig.asProvider())],
})
export class DatabaseModule {}
