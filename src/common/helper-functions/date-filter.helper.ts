import { Between } from 'typeorm';
import { BaseQueryDto } from '../dtos/base-query.dto';

export const dateFilterHelper = (queries: BaseQueryDto) => {
  if (queries.from && queries.to) {
    return Between(queries.from, queries.to);
  }
  if (queries.from && !queries.to) {
    return Between(queries.from, new Date());
  }
  if (queries.to && !queries.from) {
    return Between(new Date(), queries.to);
  }

  return undefined;
};
