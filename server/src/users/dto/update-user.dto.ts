import { PartialType } from '@nestjs/mapped-types';
import { Role } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
