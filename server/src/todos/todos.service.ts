import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Todo, User as UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/quey-todo.dto';

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

  findAll(userId: number, query: QueryTodoDto) {
    const where: any = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.startDate || query.endDate) {
      where.dueDate = {};
      if (query.startDate) where.dueDate.gte = new Date(query.startDate);
      if (query.endDate) where.dueDate.lte = new Date(query.endDate);
    }

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.order || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    return this.prisma.todo.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, user: UserType) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    // RBAC: Admins can update any todo, Users only their own
    if (user.role !== 'ADMIN' && todo.userId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to update this todo',
      );
    }

    return this.prisma.todo.update({
      where: { id },
      data: {
        ...updateTodoDto,
        dueDate: updateTodoDto.dueDate
          ? new Date(updateTodoDto.dueDate)
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: number, user: UserType) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    // RBAC: Admins can delete any todo, Users only their own
    if (user.role !== 'ADMIN' && todo.userId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this todo',
      );
    }

    return this.prisma.todo.delete({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
