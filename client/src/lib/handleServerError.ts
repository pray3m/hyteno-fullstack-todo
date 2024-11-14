import { AxiosError } from "axios";

interface ErrorResponse {
  success: false;
  message: string;
}

export const handleServerError = (
  error: AxiosError<{ message: string }>,
  defaultMessage: string
): ErrorResponse => {
  if (!error.response) {
    console.error("Network error:", error);
    return {
      success: false,
      message: "Server is offline. Please try again later.",
    };
  }
  const serverMessage = error.response?.data?.message || defaultMessage;
  console.error("Server error:", serverMessage);
  return {
    success: false,
    message: serverMessage,
  };
};
