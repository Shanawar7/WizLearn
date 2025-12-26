import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { Friendship, FriendshipStatus } from './entities/friendship.entity';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { User } from '../users/entities/user.entity';
import { Enrollment, EnrollmentStatus } from '../enrollments/entities/enrollment.entity';

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(Friendship)
        private friendshipsRepository: Repository<Friendship>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Enrollment)
        private enrollmentsRepository: Repository<Enrollment>,
    ) { }

    async sendRequest(createFriendshipDto: CreateFriendshipDto, sender: User) {
        const { friendId } = createFriendshipDto;

        if (sender.friendId === friendId) {
            throw new BadRequestException('You cannot friend yourself');
        }

        const receiver = await this.usersRepository.findOne({ where: { friendId } });
        if (!receiver) {
            throw new NotFoundException('User with this Friend ID not found');
        }

        const existing = await this.friendshipsRepository.findOne({
            where: [
                { sender: { id: sender.id }, receiver: { id: receiver.id } },
                { sender: { id: receiver.id }, receiver: { id: sender.id } }
            ]
        });

        if (existing) {
            if (existing.status === FriendshipStatus.PENDING) {
                throw new ConflictException('Friend request already pending');
            }
            if (existing.status === FriendshipStatus.ACCEPTED) {
                throw new ConflictException('You are already friends');
            }
            existing.status = FriendshipStatus.PENDING;
            existing.sender = sender;
            existing.receiver = receiver;
            return this.friendshipsRepository.save(existing);
        }

        const friendship = this.friendshipsRepository.create({
            sender,
            receiver,
            status: FriendshipStatus.PENDING,
        });

        return this.friendshipsRepository.save(friendship);
    }

    async getRequests(user: User) {
        return this.friendshipsRepository.find({
            where: {
                receiver: { id: user.id },
                status: FriendshipStatus.PENDING,
            },
            relations: ['sender'],
            order: { createdAt: 'DESC' },
        });
    }

    async getFriends(user: User) {
        const friendships = await this.friendshipsRepository.find({
            where: [
                { sender: { id: user.id }, status: FriendshipStatus.ACCEPTED },
                { receiver: { id: user.id }, status: FriendshipStatus.ACCEPTED },
            ],
            relations: ['sender', 'receiver'],
        });

        return friendships.map(f => {
            return f.sender.id === user.id ? f.receiver : f.sender;
        });
    }

    async acceptRequest(id: string, user: User) {
        const friendship = await this.friendshipsRepository.findOne({
            where: { id },
            relations: ['receiver']
        });

        if (!friendship) throw new NotFoundException('Friend request not found');
        if (friendship.receiver.id !== user.id) throw new BadRequestException('Unauthorized');

        friendship.status = FriendshipStatus.ACCEPTED;
        return this.friendshipsRepository.save(friendship);
    }

    async rejectRequest(id: string, user: User) {
        const friendship = await this.friendshipsRepository.findOne({
            where: { id },
            relations: ['receiver']
        });

        if (!friendship) throw new NotFoundException('Friend request not found');
        if (friendship.receiver.id !== user.id) throw new BadRequestException('Unauthorized');

        return this.friendshipsRepository.remove(friendship);
    }

    async removeFriend(friendId: string, user: User) {
        const friendship = await this.friendshipsRepository.findOne({
            where: [
                { sender: { id: user.id }, receiver: { id: friendId }, status: FriendshipStatus.ACCEPTED },
                { sender: { id: friendId }, receiver: { id: user.id }, status: FriendshipStatus.ACCEPTED }
            ]
        });

        if (!friendship) throw new NotFoundException('Friendship not found');
        return this.friendshipsRepository.remove(friendship);
    }

    async getRecommendations(user: User) {
        // 1. Get current friends to exclude them
        const friends = await this.getFriends(user);
        const friendIds = friends.map(f => f.id);
        const excludeIds = [...friendIds, user.id];

        // 2. Strategy A: Friends of Friends (Mutual Connections)
        const myFriendships = await this.friendshipsRepository.find({
            where: [
                { sender: { id: user.id }, status: FriendshipStatus.ACCEPTED },
                { receiver: { id: user.id }, status: FriendshipStatus.ACCEPTED },
            ],
            relations: ['sender', 'receiver'],
        });

        const mutualFriendIds = new Set<string>();
        for (const f of myFriendships) {
            const actualFriend = f.sender.id === user.id ? f.receiver : f.sender;
            const friendsOfFriend = await this.getFriends(actualFriend);
            friendsOfFriend.forEach(fof => {
                if (!excludeIds.includes(fof.id)) {
                    mutualFriendIds.add(fof.id);
                }
            });
        }

        // 3. Strategy B: Peers in same courses
        const myEnrollments = await this.enrollmentsRepository.find({
            where: { user: { id: user.id }, status: EnrollmentStatus.APPROVED },
            relations: ['course']
        });

        const courseIds = myEnrollments.map(e => e.course.id);
        const peerIdsFromCourses = new Set<string>();

        if (courseIds.length > 0) {
            const peers = await this.enrollmentsRepository.find({
                where: {
                    course: { id: In(courseIds) },
                    user: { id: Not(user.id) },
                    status: EnrollmentStatus.APPROVED
                },
                relations: ['user']
            });
            peers.forEach(p => {
                if (!excludeIds.includes(p.user.id)) {
                    peerIdsFromCourses.add(p.user.id);
                }
            });
        }

        // 4. Combine and fetch user details
        const allRecommendedIds = [...new Set([...mutualFriendIds, ...peerIdsFromCourses])];

        if (allRecommendedIds.length === 0) return [];

        return this.usersRepository.find({
            where: { id: In(allRecommendedIds) },
            select: ['id', 'email', 'name', 'friendId', 'role', 'avatarUrl']
        });
    }
}
