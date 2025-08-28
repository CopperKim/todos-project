import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { type RecruitOpts, RecruitService } from "./recruit.service";
import { recruitDto } from "../../common/dto/recruit.dto";
import { GetCurrentUser } from "../../common/decorator/getcurrentuser.decorator";

@Controller('/api/recruit') 
export class RecruitController {
    constructor(
        private readonly recruitService: RecruitService
    ) {} 

    @Get()
    async getRecruitByOpt(
        @Body() opt: RecruitOpts
    ) {
        return await this.recruitService.getRecruitByOpt(opt) 
    }

    @Get(':id')
    async getRecruitById(
        @Param() authorId: string
    ) {
        return await this.recruitService.getRecruitById(authorId) 
    }

    @Post() 
    async addRecruit(
        @GetCurrentUser('sub') studentId: string, 
        @Body() dto: recruitDto
    ) {
        return await this.recruitService.addRecruit(studentId, dto)
    }

    @Patch(':id')
    async updateRecruit(
        @Param('id') recruitId: string, 
        @GetCurrentUser('sub') studentId: string, 
        @Body() dto: recruitDto
    ) {
        return await this.recruitService.updateRecruit(recruitId, studentId, dto)
    }

    @Delete(':id')
    async deleteRecruit(
        @Param('id') recruitId: string
    ) {
        return await this.recruitService.deleteRecruit(recruitId)
    }
}