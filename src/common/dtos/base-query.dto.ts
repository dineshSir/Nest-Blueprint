import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SortingOrder } from '../enums/sorting-order.enum';

export class BaseQueryDto {
  @IsDate()
  @IsOptional()
  @Transform((v) => new Date(v.value))
  from?: Date;

  @IsDate()
  @IsOptional()
  @Transform((v) => new Date(v.value))
  to?: Date;

  @IsNumber()
  @IsOptional()
  @Transform((v) => Number(v.value))
  page?: number;

  @IsNumber()
  @IsOptional()
  @Transform((v) => Number(v.value))
  size?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(SortingOrder)
  orderBy?: SortingOrder;

  @IsOptional()
  @IsBoolean()
  @Transform((v) => {
    if (typeof v.obj.deleted === 'string') {
      if (v.obj.deleted === 'false') {
        return false;
      }
    }
    return Boolean(v.obj.deleted);
  })
  deleted?: boolean;
}
