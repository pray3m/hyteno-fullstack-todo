import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { roundsOfHashing } from 'src/auth/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from 'src/notifications/events/user-created-event';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) throw new ConflictException('User already exists');

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;
    const user = await this.prisma.user.create({ data: createUserDto });

    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(user.id, user.name, user.email),
    );

    return user;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) throw new NotFoundException("User doesn't exists");

    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  async remove(id: number) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) throw new NotFoundException("User doesn't exists");

    return this.prisma.user.delete({ where: { id } });
  }
}
