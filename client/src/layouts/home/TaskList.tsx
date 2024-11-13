import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Priority, Role, Status, Todo, User } from "@/types";
import { CalendarIcon, PaperclipIcon } from "lucide-react";
import React, { useState } from "react";
import AddTodoForm from "./TodoForm";

interface TaskListProps {
  currentUser: User;
}

const TaskList: React.FC<TaskListProps> = ({ currentUser }) => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      title: "Complete Project Documentation",
      description: "Write detailed documentation for the MERN stack project",
      dueDate: "2024-11-14",
      priority: Priority.HIGH,
      status: Status.TODO,
      attachment: "doc.pdf",
      filePath: "/files/doc.pdf",
      owner: {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: Role.ADMIN,
        avatar: null,
      },
    },
    {
      id: 2,
      title: "Review Pull Requests",
      description: "Review and merge team PRs",
      dueDate: "2024-11-15",
      priority: Priority.MEDIUM,
      status: Status.TODO,
      attachment: null,
      owner: {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: Role.USER,
        avatar: null,
      },
    },
  ]);

  const [notifications, setNotifications] = useState<string[]>([
    "Welcome to the Todo Manager!",
    "Your account has been updated.",
  ]);

  const [showAddTodo, setShowAddTodo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("");
  const [filterOption, setFilterOption] = useState<string>("");

  // Filter, Search, and Sort Logic
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterOption === ""
        ? true
        : filterOption === "status"
        ? todo.status === Status.DONE || todo.status === Status.TODO
        : new Date(todo.createdAt).toDateString() === new Date().toDateString(); // Example for creation date filter

    return matchesSearch && matchesFilter;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortOption === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortOption === "priority") {
      return (
        Object.values(Priority).indexOf(a.priority) -
        Object.values(Priority).indexOf(b.priority)
      );
    }
    return 0;
  });

  const isOwner = (todo: Todo) => todo.owner.id === currentUser.id;

  const canModifyTodo = (todo: Todo) =>
    isOwner(todo) || currentUser.role === Role.ADMIN;

  const handleDelete = (todoId: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== todoId);
    setTodos(updatedTodos);
  };

  const handleEdit = (updatedTodo: Todo) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    setTodos(updatedTodos);
  };

  const handleAddTodo = (newTodo: Todo) => {
    setTodos([...todos, newTodo]);
  };

  return (
    <div className="space-y-4">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded">
          {notifications.map((note, index) => (
            <p key={index}>{note}</p>
          ))}
        </div>
      )}

      {/* Add New Todo Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowAddTodo(true)}>Add New Todo</Button>
      </div>

      {/* Add Todo Dialog */}
      <Dialog open={showAddTodo} onOpenChange={setShowAddTodo}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Todo</DialogTitle>
          </DialogHeader>
          <AddTodoForm
            onAdd={(todo) => {
              handleAddTodo(todo);
              setShowAddTodo(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Search, Sort, Filter */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search todos..."
          className="border p-2 rounded w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <select
            className="border p-2 rounded"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
          <select
            className="border p-2 rounded"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="">Filter</option>
            <option value="status">Status</option>
            <option value="creationDate">Creation Date</option>
          </select>
        </div>
      </div>

      {/* Todo List */}
      <div className="grid gap-4">
        {sortedTodos.map((todo) => (
          <Card key={todo.id} className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {todo.title}
                    <Badge className={getPriorityClass(todo.priority)}>
                      {todo.priority}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{todo.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{todo.owner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-500">
                    {todo.owner.name}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  Due: {new Date(todo.dueDate).toLocaleDateString()}
                </div>
                {todo.attachment && (
                  <div className="flex items-center gap-1">
                    <PaperclipIcon className="h-4 w-4" />
                    <a href={todo.filePath} download className="underline">
                      {todo.attachment}
                    </a>
                  </div>
                )}
                <Badge
                  variant={
                    todo.status === Status.DONE ? "secondary" : "default"
                  }
                >
                  {todo.status}
                </Badge>
              </div>
            </CardContent>
            {canModifyTodo(todo) && (
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    console.log("Edit functionality not implemented")
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

const getPriorityClass = (priority: Priority): string => {
  const classes: Record<Priority, string> = {
    [Priority.HIGH]: "bg-red-500 text-white",
    [Priority.MEDIUM]: "bg-yellow-500 text-white",
    [Priority.LOW]: "bg-green-500 text-white",
  };
  return classes[priority] || "bg-gray-500 text-white";
};

export default TaskList;
