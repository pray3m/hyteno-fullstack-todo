import { Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new todo item.
   * @param userId - ID of the user creating the todo.
   * @param createTodoDto - Data for creating a todo.
   * @param file - Optional file attached to the todo.
   * @returns The created todo.
   */
  async create(
    userId: number,
    createTodoDto: CreateTodoDto,
    file?: Express.Multer.File,
  ): Promise<Todo> {
    const todoData = {
      ...createTodoDto,
      userId,
      ...(file && {
        imageUrl: file.path,
        fileName: file.originalname,
        filePath: file.path,
      }),
    };

    return this.prisma.todo.create({
      data: todoData,
    });
  }

  findAll() {
    return `This action returns all todos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
