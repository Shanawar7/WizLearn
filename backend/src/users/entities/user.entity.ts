import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Course } from '../../courses/entities/course.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { Friendship } from '../../friends/entities/friendship.entity';
import { Message } from '../../chat/entities/message.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column({ unique: true })
    friendId: string;

    @Index({ unique: true })
    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    name: string;

    @Column({ default: 'student' })
    role: string;

    @Column({ nullable: true })
    avatarUrl: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ default: false })
    isBlocked: boolean;

    @Column({ type: 'timestamp', nullable: true })
    blockedUntil: Date;

    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Course, (course) => course.user)
    courses: Course[];

    @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
    enrollments: Enrollment[];

    @OneToMany(() => Friendship, (friendship) => friendship.sender)
    sentFriendships: Friendship[];

    @OneToMany(() => Friendship, (friendship) => friendship.receiver)
    receivedFriendships: Friendship[];

    @OneToMany(() => Message, (message) => message.sender)
    sentMessages: Message[];

    @OneToMany(() => Message, (message) => message.receiver)
    receivedMessages: Message[];
}
