import axiosInstance from "@/lib/axios";
import { handleServerError } from "@/lib/handleServerError";
import { AxiosError } from "axios";
import { Role, User } from "@/types";

// Define response types
interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  message: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

const handleResponse = async <T>(
  promise: Promise<T>
): Promise<ApiResponse<T>> => {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (error) {
    return handleServerError(
      error as AxiosError<{ message: string }>,
      "Operation failed."
    );
  }
};

interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export const createUser = async (
  data: CreateUserData
): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosInstance.post("/users", data);
    return response.status === 201
      ? { success: true, data: "User created successfully." }
      : { success: false, message: "User creation failed. Please try again." };
  } catch (error) {
    return handleServerError(
      error as AxiosError<{ message: string }>,
      "User creation failed."
    );
  }
};

export const fetchUsers = async (): Promise<ApiResponse<User[]>> => {
  return handleResponse(
    axiosInstance.get<User[]>("/users").then((response) => response.data)
  );
};

export const updateUserRole = async (
  userId: number,
  role: Role
): Promise<ApiResponse<User>> => {
  return handleResponse(
    axiosInstance
      .patch<User>(`/users/${userId}`, { role })
      .then((response) => response.data)
  );
};

export const deleteUser = async (
  userId: number
): Promise<ApiResponse<string>> => {
  try {
    await axiosInstance.delete(`/users/${userId}`);
    return { success: true, data: "User deleted successfully" };
  } catch (error) {
    return handleServerError(
      error as AxiosError<{ message: string }>,
      "Failed to delete user."
    );
  }
};
