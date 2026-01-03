import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesService } from './resources.service';
import { ConfigService } from '@nestjs/config';

describe('ResourcesService', () => {
    let service: ResourcesService;

    const mockConfigService = {
        get: jest.fn().mockReturnValue('mock_api_key'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ResourcesService,
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<ResourcesService>(ResourcesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should have searchYouTube method', () => {
        expect(service.searchYouTube).toBeDefined();
    });

    it('should have searchGoogleBooks method', () => {
        expect(service.searchGoogleBooks).toBeDefined();
    });
});
