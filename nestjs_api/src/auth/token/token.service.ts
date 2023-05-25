import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Payload } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { RedisService } from "@liaoliaots/nestjs-redis";

export type TokenType = "access" | "refresh";

@Injectable()
export class TokenService {
  constructor(private readonly redisService: RedisService,
              private readonly jwtService: JwtService,
              private readonly configService: ConfigService) {
  }

  signToken(payload: Payload, type: TokenType) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get(type === "access" ? "JWT_ACCESS_SECRET" : "JWT_REFRESH_SECRET"),
      expiresIn: Number(this.configService.get(type === "access" ? "JWT_ACCESS_EXPIRATION" : "JWT_REFRESH_EXPIRATION"))
    });
  }

  validateToken(token: string, type: TokenType) {
    try {
      let { exp, iat, ...payload } = this.jwtService.verify(
        token, {
          secret: this.configService.get(type === "access" ? "JWT_ACCESS_SECRET" : "JWT_REFRESH_SECRET")
        }
      );
      return payload;
    } catch (error) {
      throw new UnauthorizedException(`Invalid token: ${error.message}`);
    }
  }

  async saveToken(payload: Payload, token: string, type: TokenType) {
    return this.redisService.getClient().set(`${payload.id}:${type}`, token,
      "EX", Number(this.configService.get(type === "access" ? "JWT_ACCESS_EXPIRATION" : "JWT_REFRESH_EXPIRATION")));
  }

  async deleteToken(payload: Payload, type: TokenType) {
    return this.redisService.getClient().del(`${payload.id}:${type}`);
  }

  async verifyToken(payload: Payload, type: TokenType) {
    if (!this.redisService.getClient().get(`${payload.id}:${type}`))
      throw new UnauthorizedException("Token expired!");
  }
}