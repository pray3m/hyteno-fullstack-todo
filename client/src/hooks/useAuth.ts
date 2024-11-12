import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // TODO: Validate token with the backend
      setIsAuthenticated(true);
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    }
  }, []);

  return { isAuthenticated, user };
}
