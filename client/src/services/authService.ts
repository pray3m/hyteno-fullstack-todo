import axiosInstance from "@/lib/axios";
import { handleServerError } from "@/lib/handleServerError";
import { useAuthStore } from "@/store/authStore";
import { AxiosError } from "axios";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const login = async (data: LoginData) => {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    const { accessToken, user } = response.data;

    useAuthStore.getState().setAuth(accessToken, user);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    return { success: true };
  } catch (error) {
    return handleServerError(
      error as AxiosError<{ message: string }>,
      "Invalid credentials"
    );
  }
};

export const logout = () => {
  useAuthStore.getState().clearAuth();
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

export const register = async (data: RegisterData) => {
  try {
    const response = await axiosInstance.post("/auth/register", data);
    return response.status === 201
      ? { success: true, message: "Registration successful. Please log in." }
      : { success: false, message: "Registration failed. Please try again." };
  } catch (error) {
    return handleServerError(
      error as AxiosError<{ message: string }>,
      "Registration failed."
    );
  }
};
