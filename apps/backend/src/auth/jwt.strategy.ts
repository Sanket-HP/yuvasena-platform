import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'yuvasena-super-secret-key-2026',
    });
  }

  async validate(payload: { sub: string; email: string; phone: string; role: string }) {
    const cacheKey = `user:session:${payload.sub}`;
    
    // 1. Check Redis Cache
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      // Fail-silent on cache failure to prevent API disruption
    }

    // 2. Fetch from PostgreSQL
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        memberProfile: {
          select: {
            id: true,
            membershipNo: true,
            status: true,
            districtId: true,
            talukaId: true
          }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    // 3. Cache back to Redis (TTL = 300 seconds)
    try {
      await this.redis.set(cacheKey, JSON.stringify(user), 300);
    } catch (err) {
      // Fail-silent
    }

    return user;
  }
}

