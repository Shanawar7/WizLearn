import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFriendshipDto {
    @IsNotEmpty()
    @IsString()
    friendId: string;
}
