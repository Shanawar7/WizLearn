import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { Course } from '../courses/entities/course.entity';
import { Material } from '../materials/entities/material.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Course, Material])],
    providers: [GeminiService],
    controllers: [GeminiController],
    exports: [GeminiService],
})
export class GeminiModule { }
