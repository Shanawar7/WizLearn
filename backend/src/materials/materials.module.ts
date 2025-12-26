import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { Material } from './entities/material.entity';
import { MaterialFile } from './entities/material-file.entity';
import { Course } from '../courses/entities/course.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Material, MaterialFile, Course])],
    controllers: [MaterialsController],
    providers: [MaterialsService],
})
export class MaterialsModule { }
