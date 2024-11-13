import axiosInstance from "@/lib/axios";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const register = async (data: RegisterData) => {
  try {
    const response = await axiosInstance.post("/users", data);

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
