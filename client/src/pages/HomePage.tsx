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
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar setShowUserManagement={setShowUserManagement} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskList currentUser={currentUser} />
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
