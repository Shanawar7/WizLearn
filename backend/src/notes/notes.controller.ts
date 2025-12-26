import { Controller, Get, Post, Body, Delete, Param, UseGuards, Request, Query } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
    constructor(private readonly notesService: NotesService) { }

    @Post()
    create(@Body() body: { title: string; content: string; courseId?: string }, @Request() req) {
        return this.notesService.create(body.title, body.content, req.user, body.courseId);
    }

    @Get()
    findAll(@Query('courseId') courseId: string) {
        return this.notesService.findAll(courseId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.notesService.remove(id, req.user);
    }
}
