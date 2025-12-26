import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { SharedNote } from './entities/note.entity';
import { Course } from '../courses/entities/course.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SharedNote, Course])],
    providers: [NotesService],
    controllers: [NotesController],
    exports: [NotesService],
})
export class NotesModule { }
