import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAccessGuard } from "./guards/jwt-acess.guard";
import { getCurrentUser } from "./decorators/getcurrentuser.decorator";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";

@Controller('auth')
export class AuthController {
    
    constructor(private readonly authService: AuthService) {} 

    @Post('signup')
    async signup(@Body() dto: SignUpDto) {
        return this.authService.signup(dto);
    }

    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { user, tokens } = await this.authService.login(dto);

        res.cookie('access_token', tokens.access, this.authService.cookieOptsAccess());
        res.cookie('refresh_token', tokens.refresh, this.authService.cookieOptsRefresh());

        return { ok: true, userId: user.id, username: user.username };
    }

    @Post('refresh')
    @UseGuards(JwtRefreshGuard)
    async refresh(
        @getCurrentUser('sub') userId: string,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const presented = req.cookies?.['refresh_token'];
        const { access, refresh } = await this.authService.rotate(userId, presented);

        res.cookie('access_token', access, this.authService.cookieOptsAccess());
        res.cookie('refresh_token', refresh, this.authService.cookieOptsRefresh());

        return { ok: true };
    }

    @Post('logout')
    @UseGuards(JwtRefreshGuard)
    async logout(
        @getCurrentUser('sub') userId: string,
        // @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.logout(userId);
        res.clearCookie('refresh_token', this.authService.cookieOptsRefresh());
        res.clearCookie('access_token', this.authService.cookieOptsAccess());
        return { ok: true };
    } 

    @Get('me')
    @UseGuards(JwtAccessGuard)
    me(
        @getCurrentUser('sub') userId: string, 
        @getCurrentUser('username') username: string
    ) {
        return { userId, username }
    }
}