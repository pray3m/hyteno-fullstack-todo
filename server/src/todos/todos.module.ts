import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  imports: [PrismaModule, CloudinaryModule],
})
export class TodosModule {}
