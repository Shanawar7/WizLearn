import { Controller, Get, Delete, Param, UseGuards, UnauthorizedException, Patch, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('users')
    async getAllUsers() {
        return this.adminService.getAllUsers();
    }

    @Delete('users/:id')
    async deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(id);
    }

    @Get('courses')
    async getAllCourses() {
        return this.adminService.getAllCourses();
    }

    @Delete('courses/:id')
    async deleteCourse(@Param('id') id: string) {
        return this.adminService.deleteCourse(id);
    }

    @Get('stats')
    async getStats() {
        return this.adminService.getStats();
    }

    @Get('materials/:courseId')
    async getMaterialsByCourse(@Param('courseId') courseId: string) {
        return this.adminService.getMaterialsByCourse(courseId);
    }

    @Delete('materials/:id')
    async deleteMaterial(@Param('id') id: string) {
        return this.adminService.deleteMaterial(id);
    }

    @Patch('users/:id/block')
    async blockUser(
        @Param('id') id: string,
        @Body('seconds') seconds: number
    ) {
        return this.adminService.blockUser(id, seconds);
    }

    @Patch('users/:id/unblock')
    async unblockUser(@Param('id') id: string) {
        return this.adminService.unblockUser(id);
    }
}
