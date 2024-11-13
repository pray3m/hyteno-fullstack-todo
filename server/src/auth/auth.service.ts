import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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
