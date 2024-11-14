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
  avatar?: string | null;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  attachment?: string | null;
  imageUrl?: string | null;
  filePath?: string | null;
  createdAt?: string;
  user?: User;
}

export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}
