import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto): Promise<AuthEntity> {
    const { email, password } = loginAuthDto;

    // Step 1 : fetch a user with the given email
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) throw new NotFoundException(`No user found for email: ${email}`);

    // Step 2: Check if the password is correct
    const isPasswordValid = user.password === password;

    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    // Step 3 : Generate a JWT containing the user's info and return it
    return {
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }
}
