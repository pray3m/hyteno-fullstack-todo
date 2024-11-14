import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Role, Status, Todo, User as UserType } from "@/types";
import { format } from "date-fns";
import {
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
    HIGH: "text-red-700 bg-red-100 border-red-300",
    MEDIUM: "text-orange-700 bg-orange-100 border-orange-300",
    LOW: "text-green-700 bg-green-100 border-green-300",
  };

  const statusStyles = {
    [Status.TODO]: "bg-blue-100 text-blue-700 border-blue-300",
    [Status.DONE]: "bg-green-100 text-green-700 border-green-300",
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={`https://avatar.vercel.sh/${todo.user?.email}.png`}
              alt={todo.user?.name || "User avatar"}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {todo.user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              {todo.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              Created by: {todo.user?.name || "Unknown"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-700 mb-4">{todo.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={`${statusStyles[todo.status]} px-2 py-1`}>
            {todo.status === Status.DONE ? "Done" : "Todo"}
          </Badge>
          <Badge className={`${priorityStyles[todo.priority]} px-2 py-1`}>
            {todo.priority} Priority
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
                title={todo.fileName || "Attachment"}
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
        <CardFooter className="flex justify-end space-x-2 pt-2">
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
          <Button onClick={() => onDelete(todo.id)} variant="secondary" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
