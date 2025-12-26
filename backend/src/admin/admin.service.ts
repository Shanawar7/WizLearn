import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Material } from '../materials/entities/material.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
        @InjectRepository(Material)
        private materialsRepository: Repository<Material>,
    ) { }

    async getAllUsers() {
        return this.usersRepository.find({ order: { createdAt: 'DESC' } });
    }

    async deleteUser(id: string) {
        await this.usersRepository.delete(id);
        return { message: 'User deleted successfully' };
    }

    async getAllCourses() {
        return this.coursesRepository.find({
            relations: ['user', 'enrollments', 'materials'],
            order: { createdAt: 'DESC' },
        });
    }

    async deleteCourse(id: string) {
        await this.coursesRepository.delete(id);
        return { message: 'Course deleted successfully' };
    }

    async getStats() {
        const totalUsers = await this.usersRepository.count();
        const totalCourses = await this.coursesRepository.count();

        // Get popular courses (top 5 by enrollment count)
        const allCourses = await this.coursesRepository.find({
            relations: ['enrollments'],
        });
        const popularCourses = allCourses
            .map(c => ({
                id: c.id,
                title: c.title,
                studentCount: c.enrollments?.filter(e => e.status === 'APPROVED').length || 0
            }))
            .sort((a, b) => b.studentCount - a.studentCount)
            .slice(0, 5);

        // Get most active students (top 5 by total timeSpent in enrollments)
        const allUsers = await this.usersRepository.find({
            relations: ['enrollments'],
        });
        const activeStudents = allUsers
            .filter(u => u.role !== 'admin')
            .map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                totalHours: ((u.enrollments?.reduce((sum, e) => sum + (e.timeSpent || 0), 0) || 0) / 3600).toFixed(2)
            }))
            .sort((a, b) => parseFloat(b.totalHours) - parseFloat(a.totalHours))
            .slice(0, 5);

        return {
            totalUsers,
            totalCourses,
            popularCourses,
            activeStudents
        };
    }

    async blockUser(id: string, durationSeconds: number) {
        const blockedUntil = new Date(Date.now() + durationSeconds * 1000);
        await this.usersRepository.update(id, {
            isBlocked: true,
            blockedUntil
        });
        return { message: `User blocked until ${blockedUntil.toLocaleString()}` };
    }

    async unblockUser(id: string) {
        await this.usersRepository.update(id, {
            isBlocked: false,
            blockedUntil: null as any
        });
        return { message: 'User unblocked successfully' };
    }

    async getMaterialsByCourse(courseId: string) {
        return this.materialsRepository.find({
            where: { course: { id: courseId } },
            relations: ['files', 'course'],
            order: { createdAt: 'DESC' },
        });
    }

    async deleteMaterial(materialId: string) {
        await this.materialsRepository.delete(materialId);
        return { message: 'Material deleted successfully' };
    }
}
