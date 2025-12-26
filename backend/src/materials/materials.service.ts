import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { MaterialFile } from './entities/material-file.entity';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class MaterialsService {
    constructor(
        @InjectRepository(Material)
        private materialsRepository: Repository<Material>,
        @InjectRepository(MaterialFile)
        private materialFilesRepository: Repository<MaterialFile>,
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
    ) { }

    async create(courseId: string, title: string, description: string, files: Array<{ fileName: string; fileType: string; fileData: string }>) {
        const course = await this.coursesRepository.findOne({ where: { id: courseId } });
        if (!course) {
            throw new NotFoundException('Course not found');
        }

        const material = this.materialsRepository.create({
            title,
            description,
            course,
        });

        const savedMaterial = await this.materialsRepository.save(material);

        if (files && files.length > 0) {
            const fileEntities = files.map(file => this.materialFilesRepository.create({
                ...file,
                material: savedMaterial
            }));
            await this.materialFilesRepository.save(fileEntities);
            savedMaterial.files = fileEntities;
        }

        return savedMaterial;
    }

    async findAllByCourse(courseId: string) {
        return this.materialsRepository.find({
            where: { course: { id: courseId } },
            order: { createdAt: 'DESC' },
            relations: ['files']
        });
    }

    async remove(id: string) {
        const material = await this.materialsRepository.findOne({ where: { id } });
        if (!material) {
            throw new NotFoundException('Material not found');
        }
        return this.materialsRepository.remove(material);
    }
}
