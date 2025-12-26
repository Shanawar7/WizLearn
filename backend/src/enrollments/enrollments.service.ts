import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment, EnrollmentStatus } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { User } from '../users/entities/user.entity';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class EnrollmentsService {
    constructor(
        @InjectRepository(Enrollment)
        private enrollmentsRepository: Repository<Enrollment>,
        private coursesService: CoursesService,
    ) { }

    async create(createEnrollmentDto: CreateEnrollmentDto, user: User): Promise<Enrollment> {
        const course = await this.coursesService.findOneByCode(createEnrollmentDto.courseCode);

        if (!course) {
            throw new NotFoundException('Course not found with this code');
        }

        const existingEnrollment = await this.enrollmentsRepository.findOne({
            where: {
                user: { id: user.id },
                course: { id: course.id },
            },
        });

        if (existingEnrollment) {
            throw new ConflictException('You have already requested to join this course');
        }

        const enrollment = this.enrollmentsRepository.create({
            user,
            course,
            // Auto-approve if owner, otherwise pending
            status: course.userId === user.id ? EnrollmentStatus.APPROVED : EnrollmentStatus.PENDING,
        });

        return this.enrollmentsRepository.save(enrollment);
    }

    async findMyEnrollments(user: User): Promise<any[]> {
        const enrollments = await this.enrollmentsRepository.find({
            where: { user: { id: user.id } },
            relations: ['course', 'course.user', 'course.materials'],
            order: { createdAt: 'DESC' },
        });

        return enrollments.map(e => ({
            ...e,
            progress: this.calculateProgressValue(e)
        }));
    }

    async findRequestsForMyCourses(user: User): Promise<Enrollment[]> {
        return this.enrollmentsRepository.find({
            where: {
                course: { userId: user.id },
                status: EnrollmentStatus.PENDING,
            },
            relations: ['user', 'course'],
            order: { createdAt: 'DESC' },
        });
    }

    async updateStatus(id: string, status: EnrollmentStatus, user: User): Promise<Enrollment> {
        const enrollment = await this.enrollmentsRepository.findOne({
            where: { id },
            relations: ['course'],
        });

        if (!enrollment) {
            throw new NotFoundException('Enrollment request not found');
        }

        if (enrollment.course.userId !== user.id) {
            throw new NotFoundException('You are not authorized to manage this request');
        }

        enrollment.status = status;
        return this.enrollmentsRepository.save(enrollment);
    }

    private calculateProgressValue(enrollment: Enrollment): number {
        if (!enrollment.course) return 0;

        // Linear approach: (Completed Materials / Total Materials) * 100
        const materials = enrollment.course.materials || [];
        const totalMaterials = materials.length;

        if (totalMaterials === 0) return 0;

        const completedCount = enrollment.completedMaterials?.length || 0;
        return Math.round((completedCount / totalMaterials) * 100);
    }

    async toggleMaterialCompletion(enrollmentId: string, materialId: string, user: User) {
        const enrollment = await this.enrollmentsRepository.findOne({
            where: { id: enrollmentId, user: { id: user.id } },
            relations: ['course', 'course.materials']
        });
        if (!enrollment) throw new NotFoundException('Enrollment not found');

        const completed = enrollment.completedMaterials || [];
        const index = completed.indexOf(materialId);

        if (index > -1) {
            completed.splice(index, 1);
        } else {
            completed.push(materialId);
        }

        enrollment.completedMaterials = completed;
        enrollment.progress = this.calculateProgressValue(enrollment);
        return this.enrollmentsRepository.save(enrollment);
    }

    async toggleRoadmapCompletion(enrollmentId: string, taskKey: string, user: User) {
        const enrollment = await this.enrollmentsRepository.findOne({
            where: { id: enrollmentId, user: { id: user.id } },
            relations: ['course', 'course.materials']
        });
        if (!enrollment) throw new NotFoundException('Enrollment not found');

        const completed = enrollment.completedRoadmap || [];
        const index = completed.indexOf(taskKey);

        if (index > -1) {
            completed.splice(index, 1);
        } else {
            completed.push(taskKey);
        }

        enrollment.completedRoadmap = completed;
        // Roadmap tasks don't affect progress based on latest user request
        // but we update the progress column anyway in case logic changes.
        enrollment.progress = this.calculateProgressValue(enrollment);
        return this.enrollmentsRepository.save(enrollment);
    }

    async isEnrolled(userId: string, courseId: string): Promise<boolean> {
        const enrollment = await this.enrollmentsRepository.findOne({
            where: {
                user: { id: userId },
                course: { id: courseId },
                status: EnrollmentStatus.APPROVED,
            },
        });
        return !!enrollment;
    }

    async recordHeartbeat(enrollmentId: string, duration: number = 60): Promise<void> {
        const enrollment = await this.enrollmentsRepository.findOne({ where: { id: enrollmentId } });
        if (enrollment) {
            enrollment.timeSpent += duration;
            await this.enrollmentsRepository.save(enrollment);
        }
    }
}
