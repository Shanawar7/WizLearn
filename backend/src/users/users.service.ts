import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const friendId = await this.generateFriendId();

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      friendId,
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') { // Postgres unique violation code
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  private async generateFriendId(): Promise<string> {
    let friendId = '';
    let isUnique = false;

    // Retry loop to ensure uniqueness
    while (!isUnique) {
      const randomStr = randomBytes(3).toString('hex').toUpperCase();
      friendId = `WIZ-${randomStr}`;
      const existing = await this.usersRepository.findOne({ where: { friendId } });
      if (!existing) {
        isUnique = true;
      }
    }
    return friendId;
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await this.usersRepository.update(id, { password: hashedPassword });
  }
  async updateProfile(id: string, updateData: { name?: string; bio?: string; avatarUrl?: string }): Promise<User> {
    await this.usersRepository.update(id, updateData);
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new InternalServerErrorException('User not found after update');
    }
    return user;
  }

  async getAnalytics(userId: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['enrollments'],
    });
    if (!user) return { hoursLearned: 0 };

    const timeSpentSeconds = user.enrollments.reduce((sum, e) => sum + e.timeSpent, 0);
    return {
      hoursLearned: Math.round(timeSpentSeconds / 3600), // Return rounded hours
    };
  }
}
