import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Body, 
  Query, 
  Param, 
  UseGuards, 
  Req, 
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, ComplaintStatus } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { 
  ComplaintSubmitSchema, 
  ComplaintResolveSchema,
  ComplaintSubmitInput,
  ComplaintResolveInput
} from '@yuvasena/shared';

@ApiTags('Complaints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('complaints')
export class ComplaintsController {
  constructor(private complaintsService: ComplaintsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new complaint/grievance' })
  async submit(
    @Body(new ZodValidationPipe(ComplaintSubmitSchema)) body: ComplaintSubmitInput, 
    @Req() req: any
  ) {
    return this.complaintsService.submit(body, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get current member\'s complaints history' })
  async getMemberComplaints(@Req() req: any) {
    return this.complaintsService.findMemberComplaints(req.user.id);
  }

  @Get('admin')
  @Roles(Role.SUPER_ADMIN, Role.STATE_ADMIN, Role.DISTRICT_ADMIN, Role.TALUKA_ADMIN)
  @ApiOperation({ summary: 'List all complaints (Admins only)' })
  async getAdminComplaints(
    @Req() req: any,
    @Query('districtId') districtId?: string,
    @Query('status') status?: ComplaintStatus
  ) {
    // Regional Scope Isolation: District Admins are bound to their assigned district
    if (req.user.role === Role.DISTRICT_ADMIN) {
      if (!req.user.memberProfile?.districtId) {
        throw new ForbiddenException('District Admin profile is missing regional assignment');
      }
      districtId = req.user.memberProfile.districtId;
    } else if (req.user.role === Role.TALUKA_ADMIN) {
      // If we need to filter by Taluka, we fetch member status or fallback
      if (!req.user.memberProfile?.districtId) {
        throw new ForbiddenException('Taluka Admin profile is missing regional assignment');
      }
      districtId = req.user.memberProfile.districtId; // Scope to their district first
    }

    return this.complaintsService.findAll({ districtId, status });
  }

  @Patch(':id/assign')
  @Roles(Role.SUPER_ADMIN, Role.STATE_ADMIN, Role.DISTRICT_ADMIN)
  @ApiOperation({ summary: 'Assign a complaint to yourself (Admins only)' })
  async assign(@Param('id') id: string, @Req() req: any) {
    // Validate regional scoping on assignment
    if (req.user.role === Role.DISTRICT_ADMIN) {
      const complaint = await this.complaintsService.findOne(id);
      if (complaint.member.districtId !== req.user.memberProfile?.districtId) {
        throw new ForbiddenException('You cannot assign complaints outside of your district');
      }
    }
    return this.complaintsService.assign(id, req.user.id);
  }

  @Patch(':id/resolve')
  @Roles(Role.SUPER_ADMIN, Role.STATE_ADMIN, Role.DISTRICT_ADMIN)
  @ApiOperation({ summary: 'Reply and update complaint status (Admins only)' })
  async resolve(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(ComplaintResolveSchema)) body: ComplaintResolveInput,
    @Req() req: any
  ) {
    // Validate regional scoping on resolution
    if (req.user.role === Role.DISTRICT_ADMIN) {
      const complaint = await this.complaintsService.findOne(id);
      if (complaint.member.districtId !== req.user.memberProfile?.districtId) {
        throw new ForbiddenException('You cannot resolve complaints outside of your district');
      }
    }
    return this.complaintsService.resolve(id, body, req.user.id);
  }
}
