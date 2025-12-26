import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Friendship } from '../friends/entities/friendship.entity';
import { UsersModule } from '../users/users.module';
import { FriendsModule } from '../friends/friends.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, User, Friendship]),
        UsersModule,
        FriendsModule,
    ],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule { }
