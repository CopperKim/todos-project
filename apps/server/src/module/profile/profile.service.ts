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
            where : { id : userId }, 
            select : { username: true, role: true, tag: true, bio: true }
        })
        if (!user) throw new UnauthorizedException('Invalid Credentials')
        return user 
    }

    async updateProfile(userId: string, dto: profileDto) {
        return await this.prismaService.user.update({
            where: { id: userId }, 
            data: dto, 
            select : { role: true, tag: true, bio: true }
        })
    }
}