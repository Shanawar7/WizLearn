import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEnrollmentDto {
    @IsString()
    @IsNotEmpty()
    courseCode: string;
}
