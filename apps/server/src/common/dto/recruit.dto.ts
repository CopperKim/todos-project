import { IsArray, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class recruitDto {
    
    @IsString() 
    @IsOptional()
    title: string 

    @IsString() 
    @IsOptional()
    content: string 

    @IsString() 
    @IsOptional() 
    @MinLength(7) 
    @MaxLength(7)
    dayAvailable: boolean[]
    
    @IsArray() 
    @IsString({each: true})
    @IsOptional()
    tags: string[] 
}