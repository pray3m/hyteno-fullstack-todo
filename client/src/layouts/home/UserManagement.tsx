import React from "react";
import { Role, User } from "@/types";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteUser, updateUserRole } from "@/services/userService";

interface UserManagementProps {
  currentUser: User;
  users: User[];
  showUserManagement: boolean;
  setShowUserManagement: (open: boolean) => void;
  setUsers: (users: User[]) => void;
  removeUser: (userId: number) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  currentUser,
  users,
  showUserManagement,
  setShowUserManagement,
  setUsers,
  removeUser,
}) => {
  const handleDeleteUser = async (userId: number) => {
    const response = await deleteUser(userId);
    if (response.success) {
      removeUser(userId);
      toast.success("User deleted successfully.");
    } else {
      toast.error("Failed to delete user.");
    }
  };

  const handleChangeRole = async (userId: number, newRole: Role) => {
    const response = await updateUserRole(userId, newRole);
    if (response.success && response.data) {
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success(`User role updated to ${newRole}.`);
    } else {
      toast.error("Failed to update user role.");
    }
  };

  return (
    <Dialog open={showUserManagement} onOpenChange={setShowUserManagement}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>User Management</DialogTitle>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${currentUser?.email}.png`}
                      />
                      <AvatarFallback>
                        {user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {user.email}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={user.id === currentUser.id}
                      >
                        ⋮
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handleChangeRole(
                            user.id,
                            user.role === Role.USER ? Role.ADMIN : Role.USER
                          )
                        }
                      >
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagement;
