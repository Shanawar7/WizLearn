import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Material } from '../materials/entities/material.entity';

describe('AdminService', () => {
    let service: AdminService;

    const mockRepo = {
        find: jest.fn().mockResolvedValue([]),
        delete: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
        update: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdminService,
                { provide: getRepositoryToken(User), useValue: mockRepo },
                { provide: getRepositoryToken(Course), useValue: mockRepo },
                { provide: getRepositoryToken(Material), useValue: mockRepo },
            ],
        }).compile();

        service = module.get<AdminService>(AdminService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
