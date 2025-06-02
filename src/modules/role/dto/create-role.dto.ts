import { Transform, Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from "class-validator";

export class CreateRoleDto {
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value
  )
  @IsString({ message: "Role Name must be a string" })
  @IsNotEmpty({ message: "Role Name is required" })
  @Length(2, 15, {
    message: `Role name length should be greater than 2 and smaller than 15.`,
  })
  name: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value == "string" && value.trim() == "") return null;
    if (typeof value == "string") return value.trim().toLowerCase();
    return value;
  })
  @ValidateIf((value) => value !== null)
  @IsString({ message: "Role Description must be a string" })
  @Length(2, 50, {
    message: `Title length should be greater than 2 and smaller than 50.`,
  })
  description: string;

  @IsArray({ message: `Permission id's must be an array.` })
  @ArrayMinSize(1)
  @Type(() => Number)
  @IsNumber({}, { each: true, message: "Each Permission ID must be a number." })
  permissionIds: number[];
}
