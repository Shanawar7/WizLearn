import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';

describe('AdminService', () => {
    let service: AdminService;

    const mockUsersService = {
        findAll: jest.fn().mockResolvedValue([]),
        banUser: jest.fn(),
    };

    const mockCoursesService = {
        findAll: jest.fn().mockResolvedValue([]),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdminService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: CoursesService, useValue: mockCoursesService },
            ],
        }).compile();

        service = module.get<AdminService>(AdminService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
