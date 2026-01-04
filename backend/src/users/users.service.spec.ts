import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  const mockUserRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((user) => Promise.resolve({ id: Date.now(), ...user })),
    findOne: jest.fn().mockImplementation((query) => {
      // Mock finding a user
      if (query.where.email === 'test@example.com') {
        return Promise.resolve({ id: 1, email: 'test@example.com', password: 'hashedPassword', friendId: 'WIZ-TEST' });
      }
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const dto = { email: 'new@example.com', password: 'password', name: 'New User' };
    expect(await service.create(dto)).toEqual(expect.objectContaining({ email: 'new@example.com' }));
  });

  it('should find a user by email', async () => {
    const user = await service.findOneByEmail('test@example.com');
    expect(user).toBeDefined();
    expect(user!.email).toBe('test@example.com');
  });

  it('should return null if user not found', async () => {
    const user = await service.findOneByEmail('nonexistent@example.com');
    expect(user).toBeNull();
  });
});
