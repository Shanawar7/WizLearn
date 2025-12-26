import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { MaterialFile } from './material-file.entity';

@Entity()
export class Material {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Course, (course) => course.materials, { onDelete: 'CASCADE' })
    course: Course;

    @Column({ type: 'jsonb', nullable: true })
    quiz: any;

    @Column({ type: 'jsonb', nullable: true })
    roadmap: any;

    @OneToMany(() => MaterialFile, (file) => file.material, { cascade: true, eager: true })
    files: MaterialFile[];
}
