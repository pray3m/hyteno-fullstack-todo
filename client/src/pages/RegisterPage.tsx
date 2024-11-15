import RegisterForm from "@/layouts/auth/RegisterForm";
import { useAuthStore } from "@/store/authStore";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage: FC = () => {
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
