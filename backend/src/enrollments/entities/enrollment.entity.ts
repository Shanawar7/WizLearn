import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';

export enum EnrollmentStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

@Entity()
export class Enrollment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: EnrollmentStatus,
        default: EnrollmentStatus.PENDING,
    })
    status: EnrollmentStatus;

    @Column({ default: 0 })
    progress: number;

    @Column({ default: 0 })
    timeSpent: number; // Duration in seconds

    @Column({ type: 'jsonb', nullable: true, default: [] })
    completedMaterials: string[]; // List of material IDs completed

    @Column({ type: 'jsonb', nullable: true, default: [] })
    completedRoadmap: string[]; // List of roadmap task keys (e.g., "w0-d0") completed

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.enrollments, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @ManyToOne(() => Course, (course) => course.enrollments, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'courseId' })
    course: Course;

    @Column()
    courseId: string;
}
