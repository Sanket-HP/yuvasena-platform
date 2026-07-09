import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { EventsModule } from './events/events.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { NewsModule } from './news/news.module';
import { GalleryModule } from './gallery/gallery.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { GeographyModule } from './geography/geography.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    MembersModule,
    EventsModule,
    ComplaintsModule,
    NewsModule,
    GalleryModule,
    NotificationsModule,
    AnalyticsModule,
    GeographyModule,
    RedisModule,
    HealthModule
  ]
})
export class AppModule {}
