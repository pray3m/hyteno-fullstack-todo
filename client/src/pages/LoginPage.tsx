import LoginForm from "@/layouts/auth/LoginForm";
import { FC } from "react";

const LoginPage: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
