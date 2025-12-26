import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { User } from '../users/entities/user.entity';
import { Friendship, FriendshipStatus } from '../friends/entities/friendship.entity';
import { Enrollment, EnrollmentStatus } from '../enrollments/entities/enrollment.entity';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
        @InjectRepository(Friendship)
        private friendshipsRepository: Repository<Friendship>,
        @InjectRepository(Enrollment)
        private enrollmentsRepository: Repository<Enrollment>,
    ) { }

    async getRecommendations(user: User): Promise<any[]> {
        // 1. Find courses friends are taking
        const friendships = await this.friendshipsRepository.find({
            where: [
                { sender: { id: user.id }, status: FriendshipStatus.ACCEPTED },
                { receiver: { id: user.id }, status: FriendshipStatus.ACCEPTED },
            ],
            relations: ['sender', 'receiver'],
        });

        const friendIds = friendships.map(f => f.sender.id === user.id ? f.receiver.id : f.sender.id);

        let friendCourseIds: string[] = [];
        if (friendIds.length > 0) {
            const friendEnrollments = await this.enrollmentsRepository.find({
                where: { user: { id: In(friendIds) }, status: EnrollmentStatus.APPROVED },
                relations: ['course'],
            });
            friendCourseIds = [...new Set(friendEnrollments.map(e => e.course.id))];
        }

        // 2. Find popular courses (not necessarily from friends)
        // We'll just grab the top 10 most enrolled courses overall
        const popularCoursesRaw = await this.enrollmentsRepository.createQueryBuilder('enrollment')
            .select('enrollment.courseId', 'courseId')
            .addSelect('COUNT(enrollment.id)', 'count')
            .groupBy('enrollment.courseId')
            .orderBy('count', 'DESC')
            .limit(10)
            .getRawMany();

        const popularCourseIds = popularCoursesRaw.map(p => p.courseId);

        // 3. Filter out courses user is already in or owns
        const myEnrollments = await this.enrollmentsRepository.find({
            where: { user: { id: user.id } }
        });
        const myCourseIds = myEnrollments.map(e => e.courseId);
        const ownedCourses = await this.coursesRepository.find({
            where: { user: { id: user.id } }
        });
        const ownedCourseIds = ownedCourses.map(c => c.id);
        const excludeIds = [...myCourseIds, ...ownedCourseIds];

        const recommendedIds = [...new Set([...friendCourseIds, ...popularCourseIds])]
            .filter(id => !excludeIds.includes(id));

        if (recommendedIds.length === 0) return [];

        const recommendations = await this.coursesRepository.find({
            where: { id: In(recommendedIds) },
            relations: ['user', 'enrollments'],
        });

        return recommendations.map(course => ({
            ...course,
            students: course.enrollments.filter(e => e.status === EnrollmentStatus.APPROVED).length,
            enrollments: undefined,
        }));
    }

    async create(createCourseDto: CreateCourseDto, user: User): Promise<Course> {
        const { title, description } = createCourseDto;
        // Generate unique course code (e.g., C-1A2B)
        const courseCode = `C-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        const course = this.coursesRepository.create({
            title,
            description,
            courseCode,
            user,
        });

        try {
            return await this.coursesRepository.save(course);
        } catch (error) {
            console.error('Error creating course', error);
            throw new InternalServerErrorException();
        }
    }

    async findAllByUser(user: User): Promise<any[]> {
        const courses = await this.coursesRepository.find({
            where: { user: { id: user.id } },
            relations: ['materials', 'enrollments'],
        });

        return courses.map(course => ({
            ...course,
            lessons: course.materials.length,
            students: course.enrollments.filter(e => e.status === 'APPROVED').length,
            materials: undefined,
            enrollments: undefined,
        }));
    }

    async findOneByCode(courseCode: string): Promise<Course | null> {
        return this.coursesRepository.findOne({ where: { courseCode }, relations: ['user'] });
    }

    async findOne(id: string, user: any): Promise<Course | null> {
        return this.coursesRepository.findOne({
            where: { id },
            relations: ['user'],
        });
    }

    async update(id: string, updateCourseDto: any, user: User): Promise<Course | null> {
        const course = await this.coursesRepository.findOne({ where: { id, user: { id: user.id } } });
        if (!course) {
            throw new InternalServerErrorException('Course not found or access denied');
        }
        await this.coursesRepository.update(id, updateCourseDto);
        return this.coursesRepository.findOne({ where: { id } });
    }

    async remove(id: string, user: User): Promise<void> {
        await this.coursesRepository.delete({ id, user: { id: user.id } });
    }
}
