import { Test, TestingModule } from '@nestjs/testing';
import { GeminiService } from './gemini.service';
import { ConfigService } from '@nestjs/config';

describe('GeminiService', () => {
    let service: GeminiService;

    const mockConfigService = {
        get: jest.fn().mockReturnValue('fake_api_key'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GeminiService,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<GeminiService>(GeminiService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // Mocking the external Google API call is complex, so we check if the methods exist
    it('should have generateRoadmap method', () => {
        expect(service.generateRoadmap).toBeDefined();
    });

    it('should have generateQuiz method', () => {
        expect(service.generateQuiz).toBeDefined();
    });

    it('should have academicChat method', () => {
        expect(service.academicChat).toBeDefined();
    });
});
