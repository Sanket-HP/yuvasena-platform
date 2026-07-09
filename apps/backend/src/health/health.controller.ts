import { Controller, Get, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Observability')
@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check API gateway, Database, and Cache health status' })
  async check() {
    let dbStatus = 'HEALTHY';
    let redisStatus = 'HEALTHY';

    // 1. Validate Database
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (err) {
      dbStatus = 'UNHEALTHY';
    }

    // 2. Validate Redis
    try {
      const val = await this.redis.get('health_ping');
      await this.redis.set('health_ping', 'pong', 5);
    } catch (err) {
      redisStatus = 'UNHEALTHY';
    }

    const memoryUsage = process.memoryUsage();

    return {
      status: dbStatus === 'HEALTHY' && redisStatus === 'HEALTHY' ? 'UP' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: dbStatus,
        cache: redisStatus
      },
      metrics: {
        heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`
      }
    };
  }
}

