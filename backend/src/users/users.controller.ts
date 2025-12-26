import { Controller, Post, Body, Get, Patch, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Request() req, @Body() updateData: { name?: string; bio?: string; avatarUrl?: string }) {
    return this.usersService.updateProfile(req.user.id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('analytics')
  getAnalytics(@Request() req) {
    return this.usersService.getAnalytics(req.user.id);
  }
}
