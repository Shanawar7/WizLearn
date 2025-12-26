import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity()
export class SharedNote {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User)
    author: User;

    @ManyToOne(() => Course, { nullable: true })
    course: Course;
}
