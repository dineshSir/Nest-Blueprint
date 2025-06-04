import { BadRequestException } from '@nestjs/common';
import { BaseQueryDto } from '../dtos/base-query.dto';
import { SortingOrder } from '../enums/sorting-order.enum';

export const createSortingConfiguration = (
  queries: BaseQueryDto,
  sortables?: string[],
) => {
  const sortBy = queries.sortBy || 'updatedAt';
  const orderBy: SortingOrder = queries.orderBy || SortingOrder.DESC;

  sortables?.push('updatedAt');

  if (sortables && !sortables.includes(sortBy)) {
    throw new BadRequestException('Cannot use ' + sortBy + ' to sort.');
  }
  return {
    [sortBy]: orderBy,
  };
};

//calling (see google docs to do this with querybuilder)
// async findAll(query: BaseQueryDto) {
//   const paginationConfiguration = createPaginationConfig(query);
//   console.log(paginationConfiguration);
//   const sortingConfiguration = createSortingConfiguration(
//     query,
//     TestSortables,
//   );
//   const testRepository = this.dataSource.manager.getRepository(Test);
//   const tests = await testRepository.find({
//     select: ['id', 'price', 'createdAt'],
//     ...paginationConfiguration,
//     order: sortingConfiguration,
//   });
//   return tests;
// }

//======> localhost:3000/test?page=1&&sortBy=price&&orderBy=ASC
