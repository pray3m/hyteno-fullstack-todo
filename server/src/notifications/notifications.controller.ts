import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@User('id') userId: number) {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  async markAsRead(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notificationsService.markAsRead(id, userId);
  }
}
