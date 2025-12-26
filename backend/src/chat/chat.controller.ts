import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post('send')
    sendMessage(@Body() body: { receiverId: string; content: string }, @Request() req) {
        return this.chatService.sendMessage(req.user, body.receiverId, body.content);
    }

    @Get('history/:friendId')
    getHistory(@Param('friendId') friendId: string, @Request() req) {
        return this.chatService.getHistory(req.user, friendId);
    }

    @Get('interactions')
    getInteractions(@Request() req) {
        return this.chatService.getInteractions(req.user);
    }
}
