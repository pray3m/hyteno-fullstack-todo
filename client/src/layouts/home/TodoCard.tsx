import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Role, Status, Todo, User as UserType } from "@/types";
import { format } from "date-fns";
import { Badge, Calendar, CheckCircle, Trash2 } from "lucide-react";

interface TodoCardProps {
  todo: Todo;
  currentUser: UserType;
  onEdit: (todoId: number, updatedTodoData: Partial<Todo>) => void;
  onDelete: (todoId: number) => void;
}

export default function TodoCard({
  todo,
  currentUser,
  onEdit,
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

  return (
    <Card className="relative p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200">
      <CardContent className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 bg-gray-200 text-gray-700">
              <AvatarImage
                src={`https://avatar.vercel.sh/${todo.user?.email}.png`}
              />
              <AvatarFallback>
                {todo.user?.name ? todo.user.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {todo.title}
              </h3>
              <p className="text-xs text-gray-500">
                {todo.user?.name || "Unknown User"}
              </p>
            </div>
          </div>
          {canModify && (
            <div className="flex space-x-2">
              {todo.status === Status.TODO && (
                <Button
                  onClick={() => onEdit(todo.id, { status: Status.DONE })}
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Mark as Done
                </Button>
              )}
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

        <p className="text-sm text-gray-700">{todo.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Due: {format(new Date(todo.dueDate), "MMM dd, yyyy")}</span>
          </div>
          <Badge className={priorityStyles[todo.priority]}>
            Priority: {todo.priority}
          </Badge>
        </div>

        <Badge
          className={`${
            todo.status === Status.DONE
              ? "bg-green-50 text-green-600"
              : "bg-blue-50 text-blue-600"
          } mt-2 text-sm`}
        >
          Status: {todo.status === Status.DONE ? "Done" : "Todo"}
        </Badge>
      </CardContent>
    </Card>
  );
}
