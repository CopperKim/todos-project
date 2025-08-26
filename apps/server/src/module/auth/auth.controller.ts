import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { SignUpDto } from "../../common/dto/signup.dto";
import { LoginDto } from "../../common/dto/login.dto";
import { JwtAccessGuard } from "./guards/jwt-acess.guard";
import { GetCurrentUser } from "../../common/decorator/getcurrentuser.decorator";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { Public } from "../../common/decorator/public.decorator";

@Controller('auth')
export class AuthController {
    
    constructor(
        private readonly authService: AuthService, 
        private readonly jwtAccessGuard: JwtAccessGuard
    ) {} 

    @Post('signup')
    @Public() 
    async signup(@Body() dto: SignUpDto) {
        return this.authService.signup(dto);
    }

    @Post('login')
    @Public()
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { user, tokens } = await this.authService.login(dto);

        res.cookie('access_token', tokens.access, this.authService.cookieOptsAccess());
        res.cookie('refresh_token', tokens.refresh, this.authService.cookieOptsRefresh());

        return { ok: true, userId: user.id, username: user.username };
    }

    @Public()
    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    async refresh(
        @GetCurrentUser('sub') userId: string,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refresh_token = req.cookies?.['refresh_token']

        if (!refresh_token) throw new UnauthorizedException('no refresh token'); 

        const { access, refresh } = await this.authService.rotate(userId, refresh_token);

        res.cookie('access_token', access, this.authService.cookieOptsAccess());
        res.cookie('refresh_token', refresh, this.authService.cookieOptsRefresh());

        return { ok: true };
    }

    @Post('logout')
    @Public()
    @UseGuards(JwtRefreshGuard)
    async logout(
        @GetCurrentUser('sub') userId: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.logout(userId);
        res.clearCookie('refresh_token', this.authService.cookieOptsRefresh());
        res.clearCookie('access_token', this.authService.cookieOptsAccess());
        return { ok: true };
    } 

    @Get('me')
    me(
        @GetCurrentUser('sub') userId: string, 
        @GetCurrentUser('username') username: string
    ) {
        return { userId, username }
    }
}