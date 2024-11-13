import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from 'src/common/decorators/user.decorator';
import { QueryTodoDto } from './dto/quey-todo.dto';
import { User as UserType } from '@prisma/client';

@Controller('todos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf|doc|docx)$/)) {
          return cb(new Error('Unsupported file type'), false);
        }
        cb(null, true);
      },
    }),
  )
  create(
    @User('id') userId: number,
    @Body() createTodoDto: CreateTodoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.todosService.create(userId, createTodoDto, file);
  }

  @Get()
  findAll(@User('id') userId: number, @Query() query: QueryTodoDto) {
    return this.todosService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @User() user: UserType,
  ) {
    return this.todosService.update(id, updateTodoDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @User() user: UserType) {
    return this.todosService.remove(id, user);
  }
}
