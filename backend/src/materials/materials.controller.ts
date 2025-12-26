import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('materials')
@UseGuards(JwtAuthGuard)
export class MaterialsController {
    constructor(private readonly materialsService: MaterialsService) { }

    @Post(':courseId')
    create(
        @Param('courseId') courseId: string,
        @Body() body: { title: string; description: string; files: Array<{ fileName: string; fileType: string; fileData: string }> }
    ) {
        return this.materialsService.create(courseId, body.title, body.description, body.files);
    }

    @Get(':courseId')
    findAll(@Param('courseId') courseId: string) {
        return this.materialsService.findAllByCourse(courseId);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.materialsService.remove(id);
    }
}
