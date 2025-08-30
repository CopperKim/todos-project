import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsOptional, IsString } from "class-validator"

export class recruitDto {
    
    @IsString() 
    @IsOptional()
    title: string 

    @IsString() 
    @IsOptional()
    content: string 

    @IsOptional() 
    @IsArray() 
    @IsBoolean({each: true})
    @ArrayMinSize(7)
    @ArrayMaxSize(7)
    dayAvailable: boolean[]
    
    @IsArray() 
    @IsString({each: true})
    @IsOptional()
    tags: string[] 
}