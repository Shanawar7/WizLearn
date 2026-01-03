import { Test, TestingModule } from '@nestjs/testing';
import { MaterialsService } from './materials.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { Course } from '../courses/entities/course.entity';

describe('MaterialsService', () => {
    let service: MaterialsService;

    const mockRepo = {
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MaterialsService,
                { provide: getRepositoryToken(Material), useValue: mockRepo },
                { provide: getRepositoryToken(Course), useValue: mockRepo },
            ],
        }).compile();

        service = module.get<MaterialsService>(MaterialsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
