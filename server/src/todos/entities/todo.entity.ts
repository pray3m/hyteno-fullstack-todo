import { Priority, Status, Todo } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';

export class TodoEntity implements Todo {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  status: Status;
  imageUrl: string;
  fileName: string;
  filePath: string;
  createdAt: Date;
  userId: number;
  user?: UserEntity;

  constructor({ user, ...data }: Partial<TodoEntity>) {
    Object.assign(this, data);

    if (user) {
      this.user = new UserEntity(user);
    }
  }
}
