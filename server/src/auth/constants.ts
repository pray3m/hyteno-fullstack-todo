import { JwtModuleOptions } from '@nestjs/jwt';

export const roundsOfHashing = 10;

export const jwtConstants: JwtModuleOptions = {
  secret: 'DO-NOT-USE-THIS-SECRET',
  signOptions: { expiresIn: '3d' },
};
