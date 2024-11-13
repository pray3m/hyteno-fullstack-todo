import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Role } from "@/types";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      try {
        // TODO: Validate token with the backend (if necessary)
        // Simulate token validation and user fetching
        const dummyUser: User = {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: Role.ADMIN,
          avatar: null,
        };
        setUser(dummyUser);
        setIsAuthenticated(true);
        navigate("/");
        // TODO: Decode the JWT token to extract user information
      } catch (error) {
        console.error("Token decoding failed:", error);
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    // Simulate fetching user data
    const dummyUser: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: Role.ADMIN,
      avatar: null,
    };
    setUser(dummyUser);
    setIsAuthenticated(true);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  return { isAuthenticated, user, login, logout };
}
