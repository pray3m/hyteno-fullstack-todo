export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum Status {
  TODO = "TODO",
  DONE = "DONE",
}

export interface User {
  id: number;
  email: string;
  role: Role;
  name: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  imageUrl: string | null;
  fileName: string | null;
  filePath: string | null;
  createdAt: string;
  userId: number;
  user?: User;
}
export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TodoFilters {
  search?: string;
  sortBy?: "dueDate" | "priority" | "createdAt";
  sortOrder?: "asc" | "desc";
  status?: Status;
  priority?: Priority;
  startDate?: string;
  endDate?: string;
  userId?: number;
}
