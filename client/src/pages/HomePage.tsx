import Navbar from "@/layouts/home/Navbar";
import TaskList from "@/layouts/home/TaskList";
import UserManagement from "@/layouts/home/UserManagement";
import { fetchUsers } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { Role } from "@/types";
import React, { useEffect, useState } from "react";

const HomePage: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const { users, setUsers, removeUser } = useUserStore();
  const [showUserManagement, setShowUserManagement] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const response = await fetchUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    };

    if (currentUser?.role === Role.ADMIN) {
      loadUsers();
    }
  }, [currentUser, setUsers]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-2xl font-semibold text-gray-600">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar setShowUserManagement={setShowUserManagement} />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">
            Hello, {currentUser.name || "User"} 👋
          </h1>
          <p className="mt-2 text-md text-gray-600">
            Welcome to your Todo Manager. Stay organized and boost your
            productivity!
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg ">
          <TaskList currentUser={currentUser} />
        </div>
      </main>

      {currentUser.role === Role.ADMIN && (
        <UserManagement
          currentUser={currentUser}
          users={users}
          showUserManagement={showUserManagement}
          setShowUserManagement={setShowUserManagement}
          setUsers={setUsers}
          removeUser={removeUser}
        />
      )}
    </div>
  );
};

export default HomePage;
