import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../courses/entities/course.entity';
import { Repository } from 'typeorm';

@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourcesController {
    constructor(
        private readonly resourcesService: ResourcesService,
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
    ) { }

    @Get(':courseId')
    async getResources(@Param('courseId') courseId: string) {
        const course = await this.coursesRepository.findOne({ where: { id: courseId } });
        if (!course) throw new Error('Course not found');

        const [videos, books, wiki] = await Promise.all([
            this.resourcesService.searchYouTube(course.title),
            this.resourcesService.searchGoogleBooks(course.title),
            this.resourcesService.getWikipediaSummary(course.title),
        ]);

        return {
            videos,
            books,
            wiki,
        };
    }
}
