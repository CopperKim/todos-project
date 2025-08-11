import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service"; 
import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAccessStrategy } from "./strategies/jwt-access.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";

@Module({
    imports: [JwtModule.register({})], 
    controllers: [AuthController], 
    providers: [AuthService, PrismaService, JwtAccessStrategy, JwtRefreshStrategy]
})

export class AuthModule {} 