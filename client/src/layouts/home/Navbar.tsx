import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Users, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/services/authService";
import {
  getNotifications,
  markNotificationAsRead,
} from "@/services/notificationService";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { Role } from "@/types";
import { toast } from "sonner";

interface NavbarProps {
  setShowUserManagement: (show: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setShowUserManagement }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const { notifications, setNotifications, markAsRead } =
    useNotificationStore();

  useEffect(() => {
    const loadNotifications = async () => {
      const response = await getNotifications();
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    };
    loadNotifications();
  }, [setNotifications]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMarkAsRead = async (notificationId: number) => {
    const response = await markNotificationAsRead(notificationId);
    if (response.success) {
      markAsRead(notificationId);
      toast.success("Notification marked as read");
    } else {
      toast.error("Failed to mark notification as read");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Todo Manager
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-100 rounded-full w-10 h-10"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-blue-600 text-white p-0 rounded-full">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="font-normal">
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-sm text-gray-500">
                    You have {unreadCount} unread messages
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleMarkAsRead(notification.id)}
                        className={`
                          p-3 mx-1 my-1 rounded-lg cursor-pointer
                          ${
                            notification.isRead
                              ? "bg-gray-50 hover:bg-gray-100"
                              : "bg-blue-50 hover:bg-blue-100"
                          }
                          transition-colors duration-200
                        `}
                      >
                        <p className="text-sm text-gray-800">
                          {notification.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Management */}
            {currentUser?.role === Role.ADMIN && (
              <Button
                variant="outline"
                onClick={() => setShowUserManagement(true)}
                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            )}

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-gray-100"
                >
                  <Avatar className="h-9 w-9 border-2 border-gray-200">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${currentUser?.email}.png`}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {currentUser?.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2 text-sm">
                  <p className="font-medium truncate">{currentUser?.email}</p>
                  <p className="text-gray-500 text-xs">
                    {currentUser?.role.toLowerCase()}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
