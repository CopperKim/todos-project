import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from 'bcrypt';

type Tokens = { access: string; refresh: string };

@Injectable()
export class AuthService {
    
    constructor (
        private readonly prisma: PrismaService, 
        private readonly jwt: JwtService
    ) {}

    async signup(dto : SignUpDto) {

        const exists = await this.prisma.user.findUnique({ where: { username: dto.username } });
        if (exists) throw new BadRequestException('Username already exists');

        const passwordHash = await bcrypt.hash(dto.password, 12);

        await this.prisma.user.create({
            data: { username: dto.username, passwordHash },
        });

        return { ok: true };
    }

    async validateUser(username: string, password: string) {

        const user = await this.prisma.user.findUnique({ where: { username } });
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

        await this.prisma.user.update({ where: { id }, data: { refreshTokenHash: hash } });

    }

    cookieOptsAccess() {

        return {
            httpOnly: true, 
            sameSite: 'lax' as const, 
            maxAge: (Number(process.env.JWT_ACCESS_TTL) || 900) * 1000, 
            path: '/',
        };

    }
    
    cookieOptsRefresh() {
        return {
            httpOnly: true, 
            sameSite: 'lax' as const, 
            maxAge: (Number(process.env.JWT_REFRESH_TTL) || 1209600) * 1000, 
            path: '/',
        };
    }

    async login(dto: LoginDto) {

        const u = await this.validateUser(dto.username, dto.password);
        const tokens = await this.issueTokens(u.id, u.username);

        await this.saveRefreshHash(u.id, tokens.refresh);

        return { user: u, tokens };
    }

    async rotate(userId: string, presentedRefresh: string) {

        const u = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!u?.refreshTokenHash) throw new UnauthorizedException();

        const ok = await bcrypt.compare(presentedRefresh, u.refreshTokenHash);
        if (!ok) throw new UnauthorizedException();

        const tokens = await this.issueTokens(u.id, u.username);
        await this.saveRefreshHash(u.id, tokens.refresh);
        
        return tokens;
    }

    async logout(userId: string) {
        await this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null } });
        return { ok: true };
    }
}