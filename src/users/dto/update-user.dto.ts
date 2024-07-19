import { PartialType } from '@nestjs/mapped-types';
import { Role } from '../users.interface';
import { RegisterUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
    readonly id: string;
    readonly role: Role;
    readonly isActive: boolean;
    readonly avatar: string;
    readonly introduction: string;
}
