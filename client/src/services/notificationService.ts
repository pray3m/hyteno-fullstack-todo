import axiosInstance from "@/lib/axios";
import { handleServerError } from "@/lib/handleServerError";
import { AxiosError } from "axios";

export const getNotifications = async () => {
  try {
    const response = await axiosInstance.get("/notifications");
    return { success: true, data: response.data };
  } catch (error) {
    return handleServerError(
      error as AxiosError<{ message: string }>,
      "Failed to fetch notifications."
    );
  }
};

export const markNotificationAsRead = async (notificationId: number) => {
  try {
    await axiosInstance.patch(`/notifications/${notificationId}/read`, {
      isRead: true,
    });
    return { success: true, message: "Notification marked as read" };
  } catch (error) {
    return handleServerError(
      error as AxiosError<{ message: string }>,
      "Failed to mark notification as read."
    );
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    await axiosInstance.patch("/notifications/mark-all-read");
    return { success: true, message: "All notifications marked as read" };
  } catch (error) {
    return handleServerError(
      error as AxiosError<{ message: string }>,
      "Failed to mark all notifications as read."
    );
  }
};
