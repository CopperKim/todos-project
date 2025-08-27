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
    async getRecruit(
        @Body() opt: RecruitOpts
    ) {
        return await this.recruitService.getRecruit(opt) 
    }

    @Post() 
    async postRecruit(
        @GetCurrentUser('sub') studentId: string, 
        @Body() dto: recruitDto
    ) {
        return await this.recruitService.postRecruit(studentId, dto)
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