import { UserEntity } from 'src/users/entities/user.entity';

export class LoginResponseDto {
  accessToken: string;
  user: UserEntity;
}
