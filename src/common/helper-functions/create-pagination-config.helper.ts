import { BaseQueryDto } from '../dtos/base-query.dto';
import { PaginationConfigurationInterface } from '../interfaces/pagination-configuration.interface';

export const createPaginationConfig = (
  queries: BaseQueryDto,
): PaginationConfigurationInterface => {
  const page = queries.page ? +queries.page : 1;
  const size = queries.size ? +queries.size : 10;
  return {
    skip: (page - 1) * size,
    take: size,
  };
};

//calling
// async findAll(query: BaseQueryDto) {
//   const paginationConfiguration = createPaginationConfig(query);
//   console.log(paginationConfiguration);
//   const testRepository = this.dataSource.manager.getRepository(Test);
//   const tests = await testRepository.find({
//     select: ['id', 'price', 'createdAt'],
//     ...paginationConfiguration,
//   });
//   return tests;
// }

//==> localhost:3000/test?page=1&&sortBy=price&&orderBy=ASC
