import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TodosDto {

    @IsString()
    @IsOptional()
    userId: string

    @IsString()
    @IsOptional()
    todoId: string
    
    @IsString()
    @IsNotEmpty({ message : "title must not be null" })
    title: string

    @IsString()
    content: string

    @Type(() => Date)
    @IsDate({ message : "dueDate must be Date type" })
    dueDate: Date
}