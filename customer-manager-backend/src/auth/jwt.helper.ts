import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export type JwtDecodedPayload = {
    sub: string;
    email: string;
    role: string;
    name: string;
    iat: number;
    exp: number;
};

@Injectable()
export class AuthHelper {
    constructor(private readonly jwtService: JwtService) {}


    async decodeJwtToken(token: string): Promise<JwtDecodedPayload> {
        try {
            return this.jwtService.decode(token);
        } catch (error) {
            throw new HttpException(error, 500);
        }
    }
}
