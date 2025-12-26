import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum FriendshipStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
}

@Entity()
export class Friendship {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.sentFriendships)
    sender: User;

    @ManyToOne(() => User, (user) => user.receivedFriendships)
    receiver: User;

    @Column({
        type: 'enum',
        enum: FriendshipStatus,
        default: FriendshipStatus.PENDING,
    })
    status: FriendshipStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
