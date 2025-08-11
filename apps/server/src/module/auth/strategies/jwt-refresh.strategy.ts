import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from "@nestjs/passport";

type JwtPayload = { sub: string; username: string }

const fromCookie = (name : string) => (req : any) => req?.cookies?.[name] ?? null

@Injectable() 
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([fromCookie('refresh_token')]),
            secretOrKey: process.env.JWT_REFRESH_SECRET, 
            ignoreExpiration: false, 
            passReqToCallback: true
        })
    }

    validate(_req: any, payload: JwtPayload) {
        return payload
    }
}