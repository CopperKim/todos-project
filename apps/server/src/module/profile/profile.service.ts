import { PrismaService } from './../prisma/prisma.service';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { profileDto } from '../../common/dto/profile.dto';


@Injectable() 
export class ProfileService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async getProfile(userId: string) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId }, 
            select: { username: true }
        })
        const profile = await this.prismaService.profile.findUnique({ 
            where : { id : userId }, 
            select : { role: true, tags: true, bio: true }
        })

        return { ...user, ...profile }
    }

    async updateProfile(userId: string, dto: profileDto) {
        return await this.prismaService.profile.update({
            where: { id: userId }, 
            data: dto, 
            select : { role: true, tags: true, bio: true }
        })
    }
}