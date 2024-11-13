import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    const { accessToken, user } = response.data;

    useAuthStore.getState().setAuth(accessToken, user);

    //  store in localStorage for persistence
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    return { success: true };
  } catch (error: any) {
    if (!error.response) {
      console.error("Network error:", error);
      return {
        success: false,
        message: "Server is offline. Please try again later.",
      };
    }

    console.error("Login failed:", error);
    return { success: false, message: "Invalid credentials" };
  }
};

export const logout = () => {
  useAuthStore.getState().clearAuth();

  // Remove from localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const register = async (data: RegisterData) => {
  try {
    const response = await axiosInstance.post("/auth/register", data);

    if (response.status === 201) {
      return {
        success: true,
        message: "Registration successful. Please log in.",
      };
    } else {
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    }
  } catch (error: any) {
    if (!error.response) {
      console.error("Network error:", error);
      return {
        success: false,
        message: "Server is offline. Please try again later.",
      };
    }
    return {
      success: false,
      message: error.response.data.message || "Registration failed.",
    };
  }
};
