import { Test, TestingModule } from '@nestjs/testing';
import { FriendsService } from './friends.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Friendship } from './entities/friendship.entity';
import { User } from '../users/entities/user.entity';

describe('FriendsService', () => {
    let service: FriendsService;

    const mockRepo = {
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FriendsService,
                { provide: getRepositoryToken(Friendship), useValue: mockRepo },
                { provide: getRepositoryToken(User), useValue: mockRepo },
            ],
        }).compile();

        service = module.get<FriendsService>(FriendsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
