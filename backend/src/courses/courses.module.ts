import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { AuthModule } from '../auth/auth.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { Friendship } from '../friends/entities/friendship.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Course, Friendship, Enrollment]),
        AuthModule,
        forwardRef(() => EnrollmentsModule)
    ],
    controllers: [CoursesController],
    providers: [CoursesService],
    exports: [CoursesService],
})
export class CoursesModule { }
