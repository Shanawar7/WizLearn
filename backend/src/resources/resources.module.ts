import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { Course } from '../courses/entities/course.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Course])],
    providers: [ResourcesService],
    controllers: [ResourcesController],
    exports: [ResourcesService],
})
export class ResourcesModule { }
