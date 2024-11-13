import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreatedEvent } from './events/user-created-event';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Event listener for UserCreatedEvent
   */
  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    const { userId, name } = event;
    const message = `Welcome to the Todo App, ${name}!`;

    // Create notification in the database
    await this.prisma.notification.create({
      data: {
        userId,
        message,
      },
    });

    // TODO :  Send email notification to the user
    // Send real time notification via WebSocket or another mechanism
  }

  /**
   * Retrieve notifications for a specific user
   */
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(
    notificationId: number,
    userId: number,
  ): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }
}
