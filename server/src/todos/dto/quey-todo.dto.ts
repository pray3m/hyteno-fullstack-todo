import { Priority, Status } from '@prisma/client';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export class QueryTodoDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsString()
  sortBy?: 'dueDate' | 'createdAt';

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';
}
