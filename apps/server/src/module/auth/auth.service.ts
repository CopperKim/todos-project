import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, Injectable, UnauthorizedException } from "@nestjs/common";
import { SignUpDto } from "../../common/dto/signup.dto";
import { LoginDto } from "../../common/dto/login.dto";
import * as bcrypt from 'bcrypt';

type Tokens = { access: string; refresh: string };

@Injectable()
export class AuthService {
    
    constructor (
        private readonly prismaService: PrismaService, 
        private readonly jwt: JwtService
    ) {}

    async signup(dto : SignUpDto) {

        const exists = await this.prismaService.user.findUnique({ where: { username: dto.username } });
        if (exists) throw new BadRequestException('Username already exists');

        const passwordHash = await bcrypt.hash(dto.password, 12);

        const u = await this.prismaService.user.create({
            data: { username: dto.username, passwordHash },
        });

        await this.prismaService.profile.create({
            data: {
                user: { connect : { id : u.id }}, 
                role: "UNDEFINED", 
                bio: "bio", 
                tags: ["tags"], 
            }
        })

        return { ok: true };
    }

    async validateUser(username: string, password: string) {

        const user = await this.prismaService.user.findUnique({ where: { username } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) throw new UnauthorizedException('Invalid credentials');

        return user;

    }

    async issueTokens(id: string, username: string): Promise<Tokens> {

        const access = await this.jwt.signAsync(
        { sub: id, username },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: Number(process.env.JWT_ACCESS_TTL) || 900 },
        );

        const refresh = await this.jwt.signAsync(
        { sub: id, username },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: Number(process.env.JWT_REFRESH_TTL) || 1209600 },
        );

        return { access, refresh };
    }

    async saveRefreshHash(id: string, refresh: string) {

        const hash = await bcrypt.hash(refresh, 12);

        await this.prismaService.user.update({ where: { id }, data: { refreshTokenHash: hash } });

    }

    cookieOptsAccess() { // 토큰이 만료되어도 토큰이 사라지지 않음으로써 userId 등 payload 를 예외 없이 추출 가능 

        return {
            httpOnly: true, 
            sameSite: 'lax' as const,  
            path: '/',
            secure: false,
        };

    }
    
    cookieOptsRefresh() { 
        return {
            httpOnly: true, 
            sameSite: 'lax' as const, 
            path: '/',
            secure: false,
        };
    }

    async login(dto: LoginDto) {

        const u = await this.validateUser(dto.username, dto.password);
        const tokens = await this.issueTokens(u.id, u.username);

        await this.saveRefreshHash(u.id, tokens.refresh);

        return { user: u, tokens };
    }

    async rotate(userId: string, presentedRefresh: string) {

        const u = await this.prismaService.user.findUnique({ where: { id: userId } });
        if (!u?.refreshTokenHash) throw new UnauthorizedException();

        const ok = await bcrypt.compare(presentedRefresh, u.refreshTokenHash);
        if (!ok) throw new UnauthorizedException();

        const tokens = await this.issueTokens(u.id, u.username);
        await this.saveRefreshHash(u.id, tokens.refresh);
        
        return tokens;
    }

    async logout(userId: string) {
        await this.prismaService.user.update({ where: { id: userId }, data: { refreshTokenHash: null } });
        return { ok: true };
    }
}

@Injectable()
@Catch(UnauthorizedException)
export class RefreshExpiredFilter implements ExceptionFilter {
    constructor (
        private readonly authService: AuthService
    ) {}

    async catch(exception: UnauthorizedException, host: ArgumentsHost) {

        const req = host.switchToHttp().getRequest()
        const res = host.switchToHttp().getResponse()

        if (!req.path.startsWith('/auth/refresh')) {
            return res.status(401).json({ message: exception.message || 'Unauthorized' });
        }

        // console.log("Refresh error caught")

        // console.log("Path: ", req.path)

        const userId = req.user?.sub

        // console.log("userId : " + userId)

        if (!userId) return res.status(401).json({ code: 'REQ_USERID_NOT_FOUND', message: 'Unauthorized' });


        await this.authService.logout(userId);
        res.clearCookie('refresh_token', this.authService.cookieOptsRefresh());
        res.clearCookie('access_token', this.authService.cookieOptsAccess());
        
        return res.status(401).json({ code: 'REFRESH_EXPIRED', message: 'Unauthorized' });
    }
}