import { Role } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from "class-validator";

export class profileDto {

    @IsEnum(Role, { message : "role type error"} )
    @IsOptional()
    role: Role

    @IsOptional()
    bio: string
    
    @IsOptional()
    tag: string[]
}