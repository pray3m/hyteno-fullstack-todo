import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Role, Status, Todo, User as UserType } from "@/types";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle,
  Edit3,
  PaperclipIcon,
  Trash2,
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
    HIGH: "text-red-700 bg-red-100 border-red-300 hover:bg-red-200 hover:text-red-800",
    MEDIUM:
      "text-orange-700 bg-orange-100 border-orange-300 hover:bg-orange-200 hover:text-orange-800",
    LOW: "text-green-700 bg-green-100 border-green-300 hover:bg-green-200 hover:text-green-800",
    DEFAULT:
      "text-gray-700 bg-gray-100 border-gray-300 hover:bg-gray-200 hover:text-gray-800",
  };

  const statusStyles = {
    [Status.TODO]:
      "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 hover:text-blue-800",
    [Status.DONE]:
      "bg-green-100 text-green-700 border-green-300 hover:bg-green-200 hover:text-green-800",
    DEFAULT:
      "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:text-gray-800",
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <CardHeader className="pb-2 space-y-2 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <Avatar className="h-10 w-10 mb-2 sm:mb-0">
            <AvatarImage
              src={`https://avatar.vercel.sh/${todo.user?.email}.png`}
              alt={todo.user?.name || "User avatar"}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {todo.user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-grow min-w-0">
            <h3 className="text-lg font-semibold leading-tight tracking-tight truncate w-full">
              <span className="block whitespace-normal break-words">
                {todo.title}
              </span>
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              Created by: {todo.user?.name || currentUser.name || "Unknown"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2 flex-grow space-y-4">
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {todo.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge className={`${statusStyles[todo.status]} px-2 py-1`}>
            {todo.status === Status.DONE ? "Done" : "Todo"}
          </Badge>
          <Badge className={`${priorityStyles[todo.priority]} px-2 py-1`}>
            {todo.priority} Priority
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{format(new Date(todo.dueDate), "MMM dd, yyyy")}</span>
          </div>
          {todo.imageUrl && todo.fileName && (
            <div className="flex items-center">
              <PaperclipIcon className="mr-2 h-4 w-4" />
              <a
                href={todo.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline truncate max-w-[120px]"
              >
                {todo.fileName?.length > 15
                  ? `${todo.fileName.slice(0, 12)}...`
                  : todo.fileName}
              </a>
            </div>
          )}
        </div>
      </CardContent>

      {canModify && (
        <CardFooter className="flex flex-wrap justify-end gap-2 pt-2">
          <Button
            onClick={() => onEdit(todo)}
            variant="outline"
            size="sm"
            className="text-blue-600 hover:bg-blue-50"
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Edit
          </Button>
          {todo.status === Status.TODO && (
            <Button
              onClick={() => onMarkAsDone(todo)}
              variant="outline"
              size="sm"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Done
            </Button>
          )}
          <Button
            onClick={() => onDelete(todo.id)}
            variant="secondary"
            size="sm"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
