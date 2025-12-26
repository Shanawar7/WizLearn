import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EnrollmentStatus } from './entities/enrollment.entity';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
    constructor(private readonly enrollmentsService: EnrollmentsService) { }

    @Post('join')
    create(@Request() req, @Body() createEnrollmentDto: CreateEnrollmentDto) {
        return this.enrollmentsService.create(createEnrollmentDto, req.user);
    }

    @Get('my-enrollments')
    findMyEnrollments(@Request() req) {
        return this.enrollmentsService.findMyEnrollments(req.user);
    }

    @Get('requests')
    findRequestsForMyCourses(@Request() req) {
        return this.enrollmentsService.findRequestsForMyCourses(req.user);
    }

    @Patch(':id/approve')
    approve(@Request() req, @Param('id') id: string) {
        return this.enrollmentsService.updateStatus(id, EnrollmentStatus.APPROVED, req.user);
    }

    @Patch(':id/reject')
    reject(@Request() req, @Param('id') id: string) {
        return this.enrollmentsService.updateStatus(id, EnrollmentStatus.REJECTED, req.user);
    }
    @Post(':id/heartbeat')
    heartbeat(@Param('id') id: string) {
        return this.enrollmentsService.recordHeartbeat(id);
    }

    @Patch(':id/toggle-material')
    toggleMaterial(@Param('id') id: string, @Body('materialId') materialId: string, @Request() req) {
        return this.enrollmentsService.toggleMaterialCompletion(id, materialId, req.user);
    }

    @Patch(':id/toggle-roadmap')
    toggleRoadmap(@Param('id') id: string, @Body('taskKey') taskKey: string, @Request() req) {
        return this.enrollmentsService.toggleRoadmapCompletion(id, taskKey, req.user);
    }
}
