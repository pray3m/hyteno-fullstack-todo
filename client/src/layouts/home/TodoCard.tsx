import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Role, Status, Todo, User as UserType } from "@/types";
import { format } from "date-fns";
import {
  Badge,
  Calendar,
  CheckCircle,
  Trash2,
  Edit3,
  PaperclipIcon,
} from "lucide-react";

interface TodoCardProps {
  todo: Todo;
  currentUser: UserType;
  onEdit: (todo: Todo) => void;
  onMarkAsDone: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
}

export default function TodoCard({
  todo,
  currentUser,
  onEdit,
  onMarkAsDone,
  onDelete,
}: TodoCardProps) {
  const isOwner = todo.userId === currentUser.id;
  const isAdmin = currentUser.role === Role.ADMIN;
  const canModify = isOwner || isAdmin;

  const priorityStyles = {
    HIGH: "text-red-600 bg-red-50",
    MEDIUM: "text-orange-600 bg-orange-50",
    LOW: "text-green-600 bg-green-50",
  };

  const statusStyles = {
    [Status.TODO]: "bg-blue-50 text-blue-600",
    [Status.DONE]: "bg-green-50 text-green-600",
  };

  return (
    <Card className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200">
      <CardContent className="space-y-3">
        {/* Header: Avatar and Title */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 bg-gray-200 text-gray-700">
              <AvatarImage
                src={`https://avatar.vercel.sh/${todo.user?.email}.png`}
              />
              <AvatarFallback>
                {todo.user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {todo.title}
              </h3>
              <p className="text-xs text-gray-500">
                Created by: {todo.user?.name || "Unknown"}
              </p>
            </div>
          </div>
          {canModify && (
            <div className="flex space-x-2">
              {/* Edit Button */}
              <Button
                onClick={() => onEdit(todo)}
                variant="outline"
                className="text-blue-600 border-blue-600"
              >
                <Edit3 className="mr-1 h-4 w-4" />
                Edit
              </Button>
              {/* Mark as Done Button */}
              {todo.status === Status.TODO && (
                <Button
                  onClick={() => onMarkAsDone(todo)}
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Mark as Done
                </Button>
              )}
              {/* Delete Button */}
              <Button
                onClick={() => onDelete(todo.id)}
                variant="outline"
                className="text-red-600 border-red-600"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700">{todo.description}</p>

        {/* Details: Due Date and Priority */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          {/* Due Date */}
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Due: {format(new Date(todo.dueDate), "MMM dd, yyyy")}</span>
          </div>
          {/* Priority Badge */}
          <Badge
            className={`${
              priorityStyles[todo.priority]
            } px-2 py-1 rounded-lg text-xs`}
          >
            Priority: {todo.priority}
          </Badge>
        </div>

        {/* Status Badge */}
        <Badge
          className={`px-2 py-1 rounded-lg text-xs ${
            statusStyles[todo.status]
          }`}
        >
          {todo.status === Status.DONE ? "Done" : "Todo"}
        </Badge>

        {/* Attachments */}
        {todo.imageUrl && todo.fileName && (
          <div className="flex items-center space-x-2">
            <PaperclipIcon className="h-4 w-4 text-gray-500" />
            <a
              href={todo.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline truncate max-w-[120px]"
              title={todo.fileName || "Attachment"}
            >
              {todo.fileName?.length > 15
                ? `${todo.fileName.slice(0, 12)}...`
                : todo.fileName}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
