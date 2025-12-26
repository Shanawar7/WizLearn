import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Friendship, FriendshipStatus } from '../friends/entities/friendship.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Friendship)
        private friendshipsRepository: Repository<Friendship>,
    ) { }

    async sendMessage(sender: User, receiverId: string, content: string): Promise<Message> {
        const receiver = await this.usersRepository.findOne({ where: { id: receiverId } });
        if (!receiver) {
            throw new NotFoundException('Receiver not found');
        }

        // Check if they are friends
        const friendship = await this.friendshipsRepository.findOne({
            where: [
                { sender: { id: sender.id }, receiver: { id: receiverId }, status: FriendshipStatus.ACCEPTED },
                { sender: { id: receiverId }, receiver: { id: sender.id }, status: FriendshipStatus.ACCEPTED },
            ]
        });

        if (!friendship) {
            throw new ForbiddenException('You can only message your friends');
        }

        const message = this.messagesRepository.create({
            sender,
            receiver,
            content,
        });

        return this.messagesRepository.save(message);
    }

    async getInteractions(user: User) {
        // Find all unique users the current user has exchanged messages with
        const messages = await this.messagesRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.receiver', 'receiver')
            .where('message.senderId = :userId OR message.receiverId = :userId', { userId: user.id })
            .orderBy('message.createdAt', 'DESC')
            .getMany();

        const distinctUsers = new Map<string, User>();

        for (const msg of messages) {
            const otherUser = msg.senderId === user.id ? msg.receiver : msg.sender;
            if (!distinctUsers.has(otherUser.id)) {
                distinctUsers.set(otherUser.id, otherUser);
            }
        }

        return Array.from(distinctUsers.values());
    }

    async getHistory(user: User, friendId: string): Promise<Message[]> {
        return this.messagesRepository.find({
            where: [
                { sender: { id: user.id }, receiver: { id: friendId } },
                { sender: { id: friendId }, receiver: { id: user.id } },
            ],
            order: { createdAt: 'ASC' },
            relations: ['sender', 'receiver'],
        });
    }
}
