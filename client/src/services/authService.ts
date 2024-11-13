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
