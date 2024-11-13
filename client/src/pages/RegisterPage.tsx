import RegisterForm from "@/layouts/auth/RegisterForm";
import { FC } from "react";

const RegisterPage: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
