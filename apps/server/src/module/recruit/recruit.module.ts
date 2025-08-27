import { Module } from "@nestjs/common";
import { RecruitController } from "./recruit.controller";
import { RecruitService } from "./recruit.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    imports: [], 
    controllers: [RecruitController], 
    providers: [RecruitService, PrismaService] 
}) 

export class RecruitModule {} 