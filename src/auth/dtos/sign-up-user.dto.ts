import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEmail,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignUpUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @IsDefined({ message: 'Role IDs are required.' })
  @IsArray({ message: `Role id's must be an array.` })
  @ArrayMinSize(1)
  @Type(() => Number)
  @IsNumber({}, { each: true, message: 'Each Role ID must be a number.' })
  roleIds: number[];
}
