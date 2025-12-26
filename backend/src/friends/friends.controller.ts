import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) { }

    @Post('request')
    sendRequest(@Body() createFriendshipDto: CreateFriendshipDto, @Request() req) {
        return this.friendsService.sendRequest(createFriendshipDto, req.user);
    }

    @Get('requests')
    getRequests(@Request() req) {
        return this.friendsService.getRequests(req.user);
    }

    @Get('recommendations')
    getRecommendations(@Request() req) {
        return this.friendsService.getRecommendations(req.user);
    }

    @Get()
    getFriends(@Request() req) {
        return this.friendsService.getFriends(req.user);
    }

    @Patch(':id/accept')
    acceptRequest(@Param('id') id: string, @Request() req) {
        return this.friendsService.acceptRequest(id, req.user);
    }

    @Patch(':id/reject')
    rejectRequest(@Param('id') id: string, @Request() req) {
        return this.friendsService.rejectRequest(id, req.user);
    }

    @Delete(':friendId')
    removeFriend(@Param('friendId') friendId: string, @Request() req) {
        return this.friendsService.removeFriend(friendId, req.user);
    }
}
