import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

describe('SeedService', () => {
    let service: SeedService;

    const mockUsersService = {
        findOneByEmail: jest.fn(),
    };

    const mockRepo = {
        create: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SeedService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: getRepositoryToken(User), useValue: mockRepo },
            ],
        }).compile();

        service = module.get<SeedService>(SeedService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should have onApplicationBootstrap method', () => {
        expect(service.onApplicationBootstrap).toBeDefined();
    });
});
