import { Injectable } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class TodosDto {
    
    @IsString()
    @IsNotEmpty({ message : "title must not be null" })
    title: string

    @IsString()
    content: string

    @Type(() => Date)
    @IsDate({ message : "dueDate must be Date type" })
    dueDate: Date
}