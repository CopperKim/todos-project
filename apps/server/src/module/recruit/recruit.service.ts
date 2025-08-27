import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { recruitDto } from "../../common/dto/recruit.dto";

export type TagMode = 'AND' | 'OR' 

export type RecruitOpts = {
    authorId?: string 
    tags?: string[] 
    mode?: TagMode
    count?: number
}

@Injectable() 
export class RecruitService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async getRecruit(opt: RecruitOpts) { 
        if (!opt.authorId) return await this.prismaService.recruit.findMany({
            where: { studentId : opt.authorId }, 
            orderBy: { updatedAt : "desc" }
        })
        
        opt.count = ( opt.count !== undefined && Number.isInteger(opt.count) && opt.count>0 ) ? opt.count : 10 
        var findOpt; 
        if ( !opt?.tags || opt.tags.length === 0 ) findOpt = {} 
        else if (opt?.mode || opt.mode === "AND") findOpt = { tags: { hasEvery: opt.tags } } 
        else findOpt = { tags : { hasSome : opt.tags }}

        return await this.prismaService.recruit.findMany({
            where : findOpt, 
            orderBy: { updatedAt : "desc" } , 
            take: opt.count
        })
    }

    async postRecruit(studentId: string, recruitDto: recruitDto) {
        this.prismaService.recruit.create({ data: {
            student: { connect : { id : studentId }} , 
            title: recruitDto.title, 
            content: recruitDto.content, 
            dayAvailable: recruitDto?.dayAvailable ? [true, true, true, true, true, true, true] : recruitDto.dayAvailable, 
            tags: recruitDto?.tags ? [] : recruitDto.tags 
        }})
    }

    async updateRecruit(recruitId: string, studentId: string, recruitDto: recruitDto) {
        return await this.prismaService.recruit.update({ 
            where: { id : recruitId }, 
            data: {
                student: { connect: { id: studentId }} , 
                title: recruitDto?.title, 
                content: recruitDto?.content, 
                dayAvailable: recruitDto?.dayAvailable ? [true, true, true, true, true, true, true] : recruitDto.dayAvailable, 
                tags: recruitDto?.tags ? [] : recruitDto.tags 
            }
        })
    } 

    async deleteRecruit(recruitId: string) {
        return await this.prismaService.recruit.delete({ where: { id: recruitId }})
    } 
}