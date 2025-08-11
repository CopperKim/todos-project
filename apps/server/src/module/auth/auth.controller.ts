import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { getCurrentUser } from "./decorators/getcurrentuser.decorator";

@Controller('auth')
export class AuthController {
    
    constructor(private readonly auth: AuthService) {} 

    @Post('signup')
    async signup(@Body() dto: SignUpDto) {
        return this.auth.signup(dto);
    }

    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { user, tokens } = await this.auth.login(dto);

        res.cookie('access_token', tokens.access, this.auth.cookieOptsAccess());
        res.cookie('refresh_token', tokens.refresh, this.auth.cookieOptsRefresh());

        return { ok: true, userId: user.id, username: user.username };
    }

    @Post('refresh')
    @UseGuards(JwtAuthGuard)
    async refresh(
        @getCurrentUser('sub') userId: string,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const presented = req.cookies?.['refresh_token'];
        const { access, refresh } = await this.auth.rotate(userId, presented);

        res.cookie('access_token', access, this.auth.cookieOptsAccess());
        res.cookie('refresh_token', refresh, this.auth.cookieOptsRefresh());

        return { ok: true };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(
        @getCurrentUser('sub') userId: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.auth.logout(userId);
        res.clearCookie('access_token', this.auth.cookieOptsAccess());
        res.clearCookie('refresh_token', this.auth.cookieOptsRefresh());
        return { ok: true };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(
        @getCurrentUser('sub') userId: string, 
        @getCurrentUser('username') username: string
    ) {
        return { userId, username }
    }
}