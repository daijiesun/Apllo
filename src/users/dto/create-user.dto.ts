

import { PartialType } from '@nestjs/mapped-types';
import { Role } from '../users.interface';
export class RegisterUserDto {
    username: string;
    phoneNum?: string;
    password: string;
}

export class CreateUserDto extends PartialType(RegisterUserDto) {
    role: Role = Role.visitor;
    isActive: Boolean = true;
}