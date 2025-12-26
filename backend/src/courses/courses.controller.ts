import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { Course } from './entities/course.entity';
import { Friendship } from '../friends/entities/friendship.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
    constructor(
        private readonly coursesService: CoursesService,
        private readonly enrollmentsService: EnrollmentsService
    ) { }

    @Post()
    create(@Body() createCourseDto: CreateCourseDto, @Request() req) {
        return this.coursesService.create(createCourseDto, req.user);
    }

    @Get()
    findAll(@Request() req) {
        return this.coursesService.findAllByUser(req.user);
    }

    @Get('recommendations')
    getRecommendations(@Request() req) {
        return this.coursesService.getRecommendations(req.user);
    }

    @Get(':id')
    async findOne(@Request() req, @Param('id') id: string) {
        const course = await this.coursesService.findOne(id, req.user);
        if (!course) {
            throw new NotFoundException('Course not found');
        }

        // Allow Owner
        if (course.userId === req.user.id) {
            return course;
        }

        // Allow Enrolled Student
        const isEnrolled = await this.enrollmentsService.isEnrolled(req.user.id, id);
        if (!isEnrolled) {
            throw new ForbiddenException('You do not have access to this course');
        }

        return course;
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto, @Request() req) {
        return this.coursesService.update(id, updateCourseDto, req.user);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.coursesService.remove(id, req.user);
    }
}
