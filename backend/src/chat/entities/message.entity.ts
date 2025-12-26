import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.sentMessages, { eager: true })
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @Column()
    senderId: string;

    @ManyToOne(() => User, (user) => user.receivedMessages, { eager: true })
    @JoinColumn({ name: 'receiverId' })
    receiver: User;

    @Column()
    receiverId: string;
}
