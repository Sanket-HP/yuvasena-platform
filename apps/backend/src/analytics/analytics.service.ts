import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MemberStatus, ComplaintStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalMembers,
      todayRegistrations,
      pendingApprovals,
      activeComplaints,
      totalEvents,
      districtGrowth
    ] = await Promise.all([
      // 1. Total Members
      this.prisma.member.count(),

      // 2. Today's Registrations
      this.prisma.member.count({
        where: { createdAt: { gte: today } }
      }),

      // 3. Pending Approvals
      this.prisma.member.count({
        where: { status: MemberStatus.PENDING }
      }),

      // 4. Active Complaints (SUBMITTED or ASSIGNED)
      this.prisma.complaint.count({
        where: { status: { in: [ComplaintStatus.SUBMITTED, ComplaintStatus.ASSIGNED] } }
      }),

      // 5. Total Events
      this.prisma.event.count(),

      // 6. District Growth (Members grouped by district)
      this.prisma.member.groupBy({
        by: ['districtId'],
        _count: {
          id: true
        }
      })
    ]);

    // Map district IDs to District Names for growth analytics chart
    const districts = await this.prisma.district.findMany();
    const districtMap = new Map(districts.map((d: any) => [d.id, d.name]));

    const growthData = districtGrowth.map((group: any) => ({
      district: districtMap.get(group.districtId) || 'Unknown',
      count: group._count.id
    }));

    // Daily active registration counts for the last 7 days
    const dailyRegistrations = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = await this.prisma.member.count({
        where: {
          createdAt: {
            gte: d,
            lt: nextDay
          }
        }
      });

      dailyRegistrations.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        count
      });
    }

    return {
      summary: {
        totalMembers,
        todayRegistrations,
        pendingApprovals,
        activeComplaints,
        totalEvents
      },
      charts: {
        districtGrowth: growthData,
        dailyRegistrations
      }
    };
  }
}

