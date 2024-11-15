import LoginForm from "@/layouts/auth/LoginForm";
import { useAuthStore } from "@/store/authStore";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: FC = () => {
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
