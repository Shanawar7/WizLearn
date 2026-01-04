import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Material } from '../materials/entities/material.entity';
import { Repository } from 'typeorm';

describe('AdminService', () => {
    let service: AdminService;
    let usersRepo: Repository<User>;
    let coursesRepo: Repository<Course>;
    let materialsRepo: Repository<Material>;

    const createMockRepo = () => ({
        find: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdminService,
                { provide: getRepositoryToken(User), useValue: createMockRepo() },
                { provide: getRepositoryToken(Course), useValue: createMockRepo() },
                { provide: getRepositoryToken(Material), useValue: createMockRepo() },
            ],
        }).compile();

        service = module.get<AdminService>(AdminService);
        usersRepo = module.get<Repository<User>>(getRepositoryToken(User));
        coursesRepo = module.get<Repository<Course>>(getRepositoryToken(Course));
        materialsRepo = module.get<Repository<Material>>(getRepositoryToken(Material));

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Users management', () => {
        it('should get all users', async () => {
            const users = [{ id: '1', name: 'User 1' }];
            jest.spyOn(usersRepo, 'find').mockResolvedValue(users as any);

            const result = await service.getAllUsers();
            expect(result).toEqual(users);
            expect(usersRepo.find).toHaveBeenCalledWith({ order: { createdAt: 'DESC' } });
        });

        it('should delete a user', async () => {
            const id = '1';
            jest.spyOn(usersRepo, 'delete').mockResolvedValue({} as any);

            const result = await service.deleteUser(id);
            expect(result).toEqual({ message: 'User deleted successfully' });
            expect(usersRepo.delete).toHaveBeenCalledWith(id);
        });

        it('should block a user', async () => {
            const id = '1';
            const duration = 3600;
            jest.spyOn(usersRepo, 'update').mockResolvedValue({} as any);

            const result = await service.blockUser(id, duration);
            expect(result.message).toContain('User blocked until');
            expect(usersRepo.update).toHaveBeenCalledWith(id, expect.objectContaining({
                isBlocked: true,
                blockedUntil: expect.any(Date),
            }));
        });

        it('should unblock a user', async () => {
            const id = '1';
            jest.spyOn(usersRepo, 'update').mockResolvedValue({} as any);

            const result = await service.unblockUser(id);
            expect(result).toEqual({ message: 'User unblocked successfully' });
            expect(usersRepo.update).toHaveBeenCalledWith(id, {
                isBlocked: false,
                blockedUntil: null,
            });
        });
    });

    describe('Courses management', () => {
        it('should get all courses', async () => {
            const courses = [{ id: '1', title: 'Course 1' }];
            jest.spyOn(coursesRepo, 'find').mockResolvedValue(courses as any);

            const result = await service.getAllCourses();
            expect(result).toEqual(courses);
            expect(coursesRepo.find).toHaveBeenCalledWith(expect.objectContaining({
                relations: ['user', 'enrollments', 'materials'],
            }));
        });

        it('should delete a course', async () => {
            const id = '1';
            jest.spyOn(coursesRepo, 'delete').mockResolvedValue({} as any);

            const result = await service.deleteCourse(id);
            expect(result).toEqual({ message: 'Course deleted successfully' });
            expect(coursesRepo.delete).toHaveBeenCalledWith(id);
        });
    });

    describe('Stats calculation', () => {
        it('should calculate stats correctly', async () => {
            jest.spyOn(usersRepo, 'count').mockResolvedValue(10);
            jest.spyOn(coursesRepo, 'count').mockResolvedValue(5);

            const mockCourses = [
                { id: 'c1', title: 'Course 1', enrollments: [{ status: 'APPROVED' }, { status: 'APPROVED' }] },
                { id: 'c2', title: 'Course 2', enrollments: [{ status: 'APPROVED' }] }
            ];
            const mockUsers = [
                { id: 'u1', name: 'Student 1', email: 's1@e.com', role: 'student', enrollments: [{ timeSpent: 3600 }] },
                { id: 'admin', name: 'Admin', role: 'admin', enrollments: [] }
            ];

            jest.spyOn(coursesRepo, 'find').mockResolvedValue(mockCourses as any);
            jest.spyOn(usersRepo, 'find').mockResolvedValue(mockUsers as any);

            const stats = await service.getStats();

            expect(stats.totalUsers).toBe(10);
            expect(stats.totalCourses).toBe(5);
            expect(stats.popularCourses[0].studentCount).toBe(2);
            expect(stats.activeStudents[0].totalHours).toBe("1.00");
            expect(stats.activeStudents.find(u => u.name === 'Admin')).toBeUndefined();
        });
    });

    describe('Materials management', () => {
        it('should get materials by course', async () => {
            const courseId = 'c1';
            const materials = [{ id: 'm1' }];
            jest.spyOn(materialsRepo, 'find').mockResolvedValue(materials as any);

            const result = await service.getMaterialsByCourse(courseId);
            expect(result).toEqual(materials);
            expect(materialsRepo.find).toHaveBeenCalledWith(expect.objectContaining({
                where: { course: { id: courseId } },
            }));
        });

        it('should delete a material', async () => {
            const id = 'm1';
            jest.spyOn(materialsRepo, 'delete').mockResolvedValue({} as any);

            const result = await service.deleteMaterial(id);
            expect(result).toEqual({ message: 'Material deleted successfully' });
            expect(materialsRepo.delete).toHaveBeenCalledWith(id);
        });
    });
});
