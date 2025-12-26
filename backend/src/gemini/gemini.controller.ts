import { Controller, Post, Param, Body, UseGuards, Get } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../courses/entities/course.entity';
import { Material } from '../materials/entities/material.entity';
import { Repository } from 'typeorm';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class GeminiController {
    constructor(
        private readonly geminiService: GeminiService,
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
        @InjectRepository(Material)
        private materialsRepository: Repository<Material>,
    ) { }

    @Post('generate-roadmap/:courseId')
    async generateRoadmap(@Param('courseId') courseId: string) {
        const course = await this.coursesRepository.findOne({
            where: { id: courseId },
            relations: ['materials', 'materials.files']
        });

        if (!course) throw new Error('Course not found');

        const materialText = course.materials.map(m => `${m.title}: ${m.description}`).join('\n');
        const allFiles = course.materials.flatMap(m => m.files || []);

        const roadmap = await this.geminiService.generateRoadmap(course.title, materialText, allFiles);

        course.roadmap = roadmap;
        await this.coursesRepository.save(course);

        return roadmap;
    }

    @Post('generate-material-roadmap/:materialId')
    async generateMaterialRoadmap(@Param('materialId') materialId: string) {
        const material = await this.materialsRepository.findOne({
            where: { id: materialId },
            relations: ['files']
        });

        if (!material) throw new Error('Material not found');

        const roadmap = await this.geminiService.generateRoadmap(
            `Material Focus: ${material.title}`,
            material.description,
            material.files || []
        );

        material.roadmap = roadmap;
        await this.materialsRepository.save(material);

        return roadmap;
    }

    @Post('generate-quiz/:materialId')
    async generateQuiz(@Param('materialId') materialId: string) {
        const material = await this.materialsRepository.findOne({
            where: { id: materialId },
            relations: ['files']
        });

        if (!material) throw new Error('Material not found');

        const quiz = await this.geminiService.generateQuiz(material.title, material.description, material.files || []);

        material.quiz = quiz;
        await this.materialsRepository.save(material);

        return quiz;
    }

    @Post('generate-course-quiz/:courseId')
    async generateCourseQuiz(@Param('courseId') courseId: string) {
        const course = await this.coursesRepository.findOne({
            where: { id: courseId },
            relations: ['materials', 'materials.files']
        });

        if (!course) throw new Error('Course not found');

        const materialText = course.materials.map(m => `${m.title}: ${m.description}`).join('\n');
        const allFiles = course.materials.flatMap(m => m.files || []);
        const quiz = await this.geminiService.generateQuiz(`Course: ${course.title}`, materialText, allFiles);

        course.quiz = quiz;
        await this.coursesRepository.save(course);

        return quiz;
    }

    @Post('chat')
    async chat(@Body() body: { question: string; contextId: string; type: 'course' | 'material'; history?: any[] }) {
        let context = '';
        if (body.type === 'course') {
            const course = await this.coursesRepository.findOne({ where: { id: body.contextId } });
            context = course ? `Course: ${course.title}. ${course.description}` : '';
        } else {
            const material = await this.materialsRepository.findOne({ where: { id: body.contextId } });
            context = material ? `Material: ${material.title}. ${material.description}` : '';
        }

        return this.geminiService.academicChat(body.question, context, body.history);
    }

    @Post('general-chat')
    async generalChat(@Body() body: { question: string; history?: any[] }) {
        return this.geminiService.academicChat(body.question, undefined, body.history);
    }
}
