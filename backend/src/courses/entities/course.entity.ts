import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { Material } from '../../materials/entities/material.entity';

@Entity()
export class Course {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ unique: true })
    courseCode: string; // Unique public identifier like C-1234F

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.courses, { eager: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
    enrollments: Enrollment[];

    @Column({ type: 'jsonb', nullable: true })
    roadmap: any;

    @Column({ type: 'jsonb', nullable: true })
    quiz: any;

    @OneToMany(() => Material, (material) => material.course)
    materials: Material[];
}
