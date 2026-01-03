import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SharedNote } from './entities/note.entity';
import { Course } from '../courses/entities/course.entity';

describe('NotesService', () => {
    let service: NotesService;

    const mockRepo = {
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotesService,
                { provide: getRepositoryToken(SharedNote), useValue: mockRepo },
                { provide: getRepositoryToken(Course), useValue: mockRepo },
            ],
        }).compile();

        service = module.get<NotesService>(NotesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
