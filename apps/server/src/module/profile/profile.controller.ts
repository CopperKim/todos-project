import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { GetCurrentUser } from "../../common/decorator/getcurrentuser.decorator";
import { ProfileService } from "./profile.service";
import { profileDto } from "./dto/profile.dto";
import { Public } from "../../common/decorator/public.decorator";

@Controller('api/profile')
export class ProfileController {
    constructor (
        private readonly profileService: ProfileService
    ) {}

    @Get()
    async getProfile(
        @GetCurrentUser('sub') userId: string
    ) {
        return this.profileService.getProfile(userId) 
    }

    @Get(':id')
    @Public() 
    async getProfileById(
        @Param('id') userId: string
    ) {
        return this.profileService.getProfile(userId)
    }

    @Patch()
    async updateProfile(
        @GetCurrentUser('sub') userId: string, 
        @Body() dto: profileDto
    ) { 
        return this.profileService.updateProfile(userId, dto)
    }
}