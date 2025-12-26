import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
    constructor(
        private usersService: UsersService,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async onApplicationBootstrap() {
        await this.seedAdmin();
    }

    async seedAdmin() {
        const adminEmail = 'admin@wizlearn.com';
        const existingAdmin = await this.usersService.findOneByEmail(adminEmail);

        if (!existingAdmin) {
            console.log('Seeding admin user...');
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash('admin123', salt);

            // We need to bypass UsersService.create because it generates a random friend ID
            // and we might want specific admin props, though UsersService.create is fine if we just override role later.
            // But let's do it manually for control.
            const admin = this.usersRepository.create({
                email: adminEmail,
                password: hashedPassword,
                name: 'WizLearn Admin',
                role: 'admin',
                friendId: 'ADMIN-001',
            });

            await this.usersRepository.save(admin);
            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists.');
        }
    }
}
