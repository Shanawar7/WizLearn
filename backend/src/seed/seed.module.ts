import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [UsersModule, TypeOrmModule.forFeature([User])],
    providers: [SeedService],
})
export class SeedModule { }
