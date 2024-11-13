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
import { User } from 'src/common/decorators/user.decorator';
import { QueryTodoDto } from './dto/quey-todo.dto';
import { User as UserType } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('todos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    }),
  )
  async create(
    @User('id') userId: number,
    @Body() createTodoDto: CreateTodoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let uploadedFileUrl: string = null;
    let publicId: string = null;

    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      uploadedFileUrl = result.secure_url;
      publicId = result.public_id;
    }

    return this.todosService.create(
      userId,
      createTodoDto,
      uploadedFileUrl,
      publicId,
      file?.originalname,
    );
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
