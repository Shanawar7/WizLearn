import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SharedNote } from './entities/note.entity';
import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(SharedNote)
        private notesRepository: Repository<SharedNote>,
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
    ) { }

    async create(title: string, content: string, user: User, courseId?: string) {
        let course: Course | null = null;
        if (courseId) {
            course = await this.coursesRepository.findOne({ where: { id: courseId } });
        }

        const note = this.notesRepository.create({
            title,
            content,
            author: user,
            course: course || undefined,
        });

        return this.notesRepository.save(note);
    }

    async findAll(courseId?: string) {
        const queryBuilder = this.notesRepository.createQueryBuilder('note')
            .leftJoinAndSelect('note.author', 'author')
            .leftJoinAndSelect('note.course', 'course')
            .orderBy('note.createdAt', 'DESC');

        if (courseId) {
            queryBuilder.where('course.id = :courseId', { courseId });
        }

        return queryBuilder.getMany();
    }

    async remove(id: string, user: User) {
        const note = await this.notesRepository.findOne({
            where: { id },
            relations: ['author']
        });

        if (!note) throw new NotFoundException('Note not found');
        if (note.author.id !== user.id && user.role !== 'admin') {
            throw new Error('Unauthorized');
        }

        return this.notesRepository.remove(note);
    }
}
