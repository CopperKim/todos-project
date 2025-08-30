import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { type RecruitOpts, RecruitService } from "./recruit.service";
import { recruitDto } from "../../common/dto/recruit.dto";
import { GetCurrentUser } from "../../common/decorator/getcurrentuser.decorator";

@Controller('/api/recruit') 
export class RecruitController {
    constructor(
        private readonly recruitService: RecruitService
    ) {} 

    @Get('/opt')
    async getRecruitByOpt(
        @GetCurrentUser('sub') user: string, 
        @Query() opt: RecruitOpts
    ) {
        return await this.recruitService.getRecruitByOpt(user, opt) 
    }

    @Get('/authorId/:id')
    async getRecruitByAuthorId(
        @Param() authorId: string
    ) {
        return await this.recruitService.getRecruitByAuthorId(authorId) 
    }

    @Get('/recruitId/:id')
    async getRecruitByRecruitId(
        @Param() recruitId: string 
    ) {
        return await this.recruitService.getRecruitByRecruitId(recruitId)
    }

    @Post() 
    async addRecruit(
        @GetCurrentUser('sub') studentId: string, 
        @Body() dto: recruitDto
    ) {
        console.log(dto)
        return await this.recruitService.addRecruit(studentId, dto)
    }

    @Patch(':id')
    async updateRecruit(
        @Param('id') recruitId: string, 
        @GetCurrentUser('sub') studentId: string, 
        @Body() dto: recruitDto
    ) {
        console.log(dto)
        return await this.recruitService.updateRecruit(recruitId, studentId, dto)
    }

    @Delete(':id')
    async deleteRecruit(
        @Param('id') recruitId: string
    ) {
        return await this.recruitService.deleteRecruit(recruitId)
    }
}