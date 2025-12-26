import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { Enrollment } from './entities/enrollment.entity';
import { CoursesModule } from '../courses/courses.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Enrollment]),
        forwardRef(() => CoursesModule),
    ],
    controllers: [EnrollmentsController],
    providers: [EnrollmentsService],
    exports: [EnrollmentsService],
})
export class EnrollmentsModule { }
