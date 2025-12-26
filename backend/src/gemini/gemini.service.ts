import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GOOGLE_API_KEY') || '';
        this.genAI = new GoogleGenerativeAI(apiKey);

        // Using Gemini Flash for all tasks (High RPM quota for Free Tier)
        this.model = this.genAI.getGenerativeModel({ model: 'models/gemini-flash-latest' });
    }

    private fileToPart(base64Data: string, mimeType: string) {
        // Supported Gemini Multimodal MIME types
        const supportedTypes = [
            'application/pdf',
            'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif',
            'text/plain', 'text/csv', 'text/markdown'
        ];

        if (!supportedTypes.includes(mimeType)) return null;

        const base64Content = base64Data.includes('base64,')
            ? base64Data.split('base64,')[1]
            : base64Data;

        return {
            inlineData: {
                data: base64Content,
                mimeType
            }
        };
    }

    async generateRoadmap(courseTitle: string, materials: string, files: any[] = []) {
        const fileParts = files.map(f => this.fileToPart(f.fileData, f.fileType)).filter(p => p !== null);

        const prompt = `
      You are an elite academic advisor.
      GOAL: Generate a 4-week study roadmap for the course "${courseTitle}".
      
      STRICT SOURCE OF TRUTH:
      1. IGNORE generic knowledge about the course title.
      2. ONLY use topics, chapters, and keywords found in the ATTACHED FILES.
      3. Use the metadata "${materials}" only as context for the files.
      4. If documentation is provided, mapping the roadmap to the actual document structure is mandatory.
      
      FORMAT: JSON array of 4 objects (one per week). Each object must have a 'days' array. Each day in the 'days' array has 'topic', 'task', and 'description'.
    `;

        try {
            const result = await this.model.generateContent([prompt, ...fileParts]);
            const text = result.response.text();
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse roadmap JSON", raw: text };
        } catch (error) {
            console.error('Gemini Error:', error);
            throw error;
        }
    }

    async generateQuiz(materialTitle: string, content: string, files: any[] = []) {
        const fileParts = files.map(f => this.fileToPart(f.fileData, f.fileType)).filter(p => p !== null);

        const prompt = `
      You are a strict academic evaluator for the topic: "${materialTitle}".
      
      STRICT SOURCE OF TRUTH:
      1. Generate 10 multiple-choice questions based ONLY on the ATTACHED FILE CONTENT.
      2. If no files are provided (or are unreadable), use the description: "${content}".
      3. Avoid generic common-sense questions. Focus on specific facts, definitions, or code found in the files.
      
      FORMAT: JSON array of objects with 'question', 'options' (array of 4), and 'correctAnswer' (index 0-3).
    `;

        try {
            const result = await this.model.generateContent([prompt, ...fileParts]);
            const text = result.response.text();
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse quiz JSON", raw: text };
        } catch (error) {
            console.error('Gemini Error:', error);
            throw error;
        }
    }

    async academicChat(question: string, context?: string, history: { role: 'user' | 'model', parts: string[] }[] = []) {
        const historyContext = history.length > 0
            ? history.map(h => `${h.role === 'user' ? 'Student' : 'Assistant'}: ${h.parts[0]}`).join('\n')
            : '';

        const prompt = `
      You are a specialized Academic AI Assistant for the platform "WizLearn".
      
      STRICT GUIDELINES:
      1. ONLY answer questions related to academia, education, study techniques, or course specific topics.
      2. If the user asks general, non-academic, or inappropriate questions, politely decline and state that you are only here to help with academic queries.
      3. Keep your answers concise, encouraging, and educational.
      
      ${context ? `Institutional Context: ${context}` : ''}
      
      CONVERSATION HISTORY:
      ${historyContext}
      
      Student Question: ${question}
    `;

        try {
            const result = await this.model.generateContent(prompt);
            return { answer: result.response.text() };
        } catch (error) {
            console.error('Gemini Error:', error);
            throw error;
        }
    }
}
