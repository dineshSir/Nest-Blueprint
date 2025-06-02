import { InternalServerErrorException } from '@nestjs/common';
import { AppDataSource } from 'src/database/data-source-configuration';
import { QueryRunner } from 'typeorm';

export async function runInTransaction<T>(
  operation: (queryRunner: QueryRunner) => Promise<T>,
): Promise<T> {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const result = await operation(queryRunner);
    await queryRunner.commitTransaction();

    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new InternalServerErrorException('Transaction failed', error.message);
  } finally {
    await queryRunner.release();
  }
}
