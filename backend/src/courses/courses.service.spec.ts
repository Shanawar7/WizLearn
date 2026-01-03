import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Friendship } from '../friends/entities/friendship.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

describe('CoursesService', () => {
    let service: CoursesService;

    const mockCourseRepository = {
        find: jest.fn().mockResolvedValue([{ id: 1, title: 'Test Course' }]),
        findOne: jest.fn().mockImplementation((options) => {
            if (options.where.id === 1) return Promise.resolve({ id: 1, title: 'Test Course' });
            return null;
        }),
        create: jest.fn(),
        save: jest.fn().mockImplementation((course) => Promise.resolve({ id: Date.now(), ...course })),
        update: jest.fn(),
    };

    const mockFriendshipRepository = {
        find: jest.fn().mockResolvedValue([]),
    };

    const mockEnrollmentRepository = {
        find: jest.fn().mockResolvedValue([]),
        createQueryBuilder: jest.fn(() => ({
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue([]),
        })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CoursesService,
                { provide: getRepositoryToken(Course), useValue: mockCourseRepository },
                { provide: getRepositoryToken(Friendship), useValue: mockFriendshipRepository },
                { provide: getRepositoryToken(Enrollment), useValue: mockEnrollmentRepository },
            ],
        }).compile();

        service = module.get<CoursesService>(CoursesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return courses for a user', async () => {
        const user = { id: 1 } as any;
        const courses = await service.findAllByUser(user);
        expect(courses).toHaveLength(1);
    });

    it('should find one course', async () => {
        const user = { id: 1 } as any; // Mock user
        const course = await service.findOne('1', user);
        expect(course).toBeDefined();
        expect(course.id).toBe(1);
    });
});
