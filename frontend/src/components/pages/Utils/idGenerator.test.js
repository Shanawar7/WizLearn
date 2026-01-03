import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateUserId, generateCourseId, getCourseColorByIndex, saveUser, getCurrentUser, clearUser } from './idGenerator';

describe('ID Generator Utilities', () => {

    describe('generateUserId', () => {
        it('should return a string starting with WL-USER-', () => {
            const id = generateUserId();
            expect(id).toMatch(/^WL-USER-\d{5}$/);
        });
    });

    describe('generateCourseId', () => {
        it('should return a string starting with WL-COURSE-', () => {
            const id = generateCourseId();
            expect(id).toMatch(/^WL-COURSE-[A-Z0-9]{8}$/);
        });
    });

    describe('getCourseColorByIndex', () => {
        it('should return primary color for index 0', () => {
            const color = getCourseColorByIndex(0);
            expect(color.from).toBe('#1D2A50');
        });

        it('should return secondary color for index 1', () => {
            const color = getCourseColorByIndex(1);
            expect(color.from).toBe('#F0D459');
        });

        it('should cycle colors', () => {
            const color = getCourseColorByIndex(2);
            expect(color.from).toBe('#1D2A50');
        });
    });

    describe('LocalStorage Helpers', () => {
        beforeEach(() => {
            localStorage.clear();
        });

        it('should save and get user', () => {
            const user = { id: 1, name: 'Test' };
            saveUser(user);
            const retrieved = getCurrentUser();
            expect(retrieved).toEqual(user);
        });

        it('should clear user', () => {
            const user = { id: 1, name: 'Test' };
            saveUser(user);
            clearUser();
            expect(getCurrentUser()).toBeNull();
        });
    });
});
