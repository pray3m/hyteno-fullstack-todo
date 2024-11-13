import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { roundsOfHashing } from './constants';
import { UserCreatedEvent } from 'src/notifications/events/user-created-event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );
    createUserDto.password = hashedPassword;

    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(user.id, user.name, user.email),
    );

    return user;
  }

  async login(loginAuthDto: LoginAuthDto): Promise<LoginResponseDto> {
    const { email, password } = loginAuthDto;

    // Step 1 : fetch a user with the given email
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) throw new NotFoundException(`No user found for email: ${email}`);

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    // Step 3 : Generate JWT token
    const accessToken = this.jwtService.sign({ sub: user.id });
    const userEntity = new UserEntity(user);

    return {
      accessToken,
      user: userEntity,
    };
  }
}
