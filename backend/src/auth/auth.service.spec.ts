import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;

    const mockUsersService = {
        findOneByEmail: jest.fn(),
        create: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mockToken'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should have validateUser method', () => {
        expect(service.validateUser).toBeDefined();
    });

    it('should have login method', () => {
        expect(service.login).toBeDefined();
    });

    it('should return token on login', async () => {
        const user = { email: 'test@test.com', id: 1, password: 'password' };
        mockUsersService.findOneByEmail.mockResolvedValue({ ...user, password: 'hashedPassword' });

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const result = await service.login(user);
        expect(result).toHaveProperty('access_token');
        expect(result.access_token).toBe('mockToken');
    });
});
