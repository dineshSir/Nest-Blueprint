import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<T> {
  data: T[];
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  total: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  isLast: boolean;
  @ApiProperty()
  isFirst: boolean;
  @ApiProperty()
  size: number;

  constructor(
    offsetDataWithCount: [T[], number],
    pageData: {
      skip: number;
      take: number;
      page: number;
      size: number;
    },
  ) {
    const [data, total] = offsetDataWithCount;
    const { size, page } = pageData;
    const isFirst = page == 1;
    const totalPages = Math.ceil(total / size);
    const isLast = totalPages == page;
    this.currentPage = page;
    this.data = data;
    this.total = total;
    this.isFirst = isFirst;
    this.isLast = isLast;
    this.size = size;
    this.totalPages = totalPages;
  }
}
