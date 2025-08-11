import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from "@nestjs/passport";

type JwtPayload = { sub: string; username: string }

const fromCookie = (name : string) => (req : any) => req?.cookies?.[name] ?? null

@Injectable() 
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access'){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([fromCookie('access_token')]),
            secretOrKey: process.env.JWT_ACCESS_SECRET, 
            ignoreExpiration: false
        })
    }

    validate(payload: JwtPayload) {
        return payload
    }
}