import { Transform, Type } from "class-transformer";
import { IsDate, IsOptional, IsString, MaxLength } from "class-validator";

export class TodosDto { 
  // user id, todo id 는 dto 에 포함 x 
  // getCurrentUser custom decorator, param 으로 받아옴
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === "") return undefined;
    const num = typeof value === "string" ? Number(value) : value;
    const asDate = Number.isFinite(num) ? new Date(num) : new Date(value);
    return isNaN(asDate.getTime()) ? undefined : asDate;
  })
  @Type(() => Date)
  @IsDate({ message: "dueDate must be a valid Date (ISO string or ms timestamp)" })
  dueDate?: Date;
}
