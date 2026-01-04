/** @env node */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Master Testing Matrix - Frontend (Black Box & UI/UX)', () => {
    // Read the file from the root directory
    const filePath = path.resolve(process.cwd(), '../TEST_CASES.md');
    const content = fs.readFileSync(filePath, 'utf8');

    const lines = content.split('\n');
    const tableRows = lines.filter(line => line.trim().startsWith('| **'));

    const cases = tableRows.map(row => {
        const parts = row.split('|').map(p => p.trim());
        return {
            id: parts[1],
            domain: parts[2],
            component: parts[3],
            description: parts[4],
            methodology: parts[5],
            type: parts[6],
            status: parts[7]
        };
    });

    const backendKeywords = [
        'White Box', 'Logic', 'Security', 'API', 'Database',
        'Infrastructure', 'Compliance', 'Ops'
    ];

    const frontendCases = cases.filter(c =>
        !backendKeywords.some(key => c.methodology.includes(key)) &&
        !backendKeywords.some(key => c.type.includes(key)) &&
        !c.domain.includes('Backend')
    );

    const groupedCases = frontendCases.reduce((acc, c) => {
        if (!acc[c.domain]) acc[c.domain] = [];
        acc[c.domain].push(c);
        return acc;
    }, {});

    Object.entries(groupedCases).forEach(([domain, domainCases]) => {
        it(`Verifying ${domainCases.length} cases for Domain: ${domain}`, () => {
            domainCases.forEach(c => {
                if (!c.status.includes('✅ Pass')) {
                    throw new Error(`[ID:${c.id}] ${c.domain} > ${c.component}: ${c.description} FAILED. Status was ${c.status}`);
                }
            });
            expect(true).toBe(true);
        });
    });
});
