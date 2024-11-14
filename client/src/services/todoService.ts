import axiosInstance from "@/lib/axios";
import { handleServerError } from "@/lib/handleServerError";
import { AxiosError } from "axios";
import { Priority, Status } from "@/types";

interface TodoData {
  title: string;
  description: string;
  dueDate: string;
  priority?: Priority;
  status?: Status;
  file?: File;
}

export const createTodo = async (data: TodoData) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("dueDate", data.dueDate);

  if (data.priority) formData.append("priority", data.priority);
  if (data.status) formData.append("status", data.status);
  if (data.file) formData.append("file", data.file);

  try {
    const response = await axiosInstance.post("/todos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return handleServerError(
      error as AxiosError<{ message: string }>,
      "Failed to create todo."
    );
  }
};

export const getTodos = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/todos", { params });
    return { success: true, data: response.data };
  } catch (error) {
    return handleServerError(
      error as AxiosError<{ message: string }>,
      "Failed to fetch todos."
    );
  }
};

export const updateTodo = async (id: number, data: Partial<TodoData>) => {
  try {
    const response = await axiosInstance.patch(`/todos/${id}`, data);
    return { success: true, data: response.data };
  } catch (error) {
    return handleServerError(
      error as AxiosError<{ message: string }>,
      "Failed to update todo."
    );
  }
};

export const deleteTodo = async (id: number) => {
  try {
    await axiosInstance.delete(`/todos/${id}`);
    return { success: true, message: "Todo deleted successfully" };
  } catch (error) {
    return handleServerError(
      error as AxiosError<{ message: string }>,
      "Failed to delete todo."
    );
  }
};
