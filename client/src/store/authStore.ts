import { User } from "@/types";
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

const getInitialAuthState = (): AuthState => {
  const token = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");
  return {
    accessToken: token || null,
    user: user ? JSON.parse(user) : null,
    setAuth: () => {},
    clearAuth: () => {},
  };
};

export const useAuthStore = create<AuthState>()((set) => ({
  ...getInitialAuthState(),
  setAuth: (token, user) => set({ accessToken: token, user }),
  clearAuth: () => set({ accessToken: null, user: null }),
}));
