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
  name: string;
  email: string;
  role: Role;
  avatar: string | null;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  dueDate: string; // ISO string
  priority: Priority;
  status: Status;
  attachment?: string | null;
  filePath?: string | null;
  owner: User;
}

export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO string
}
