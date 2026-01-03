import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsService } from './enrollments.service';
import { CoursesService } from '../courses/courses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';

describe('EnrollmentsService', () => {
    let service: EnrollmentsService;

    const mockEnrollmentRepo = {
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
    };

    const mockCoursesService = {
        findOneByCode: jest.fn(),
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EnrollmentsService,
                { provide: getRepositoryToken(Enrollment), useValue: mockEnrollmentRepo },
                { provide: CoursesService, useValue: mockCoursesService },
            ],
        }).compile();

        service = module.get<EnrollmentsService>(EnrollmentsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
