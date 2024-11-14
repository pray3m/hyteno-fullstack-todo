import { Input } from "@/components/ui/input";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "@/services/todoService";
import { Status, Todo, User, Priority } from "@/types";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TodoCard from "./TodoCard";
import AddTodoForm, { FormData } from "./TodoForm";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface TaskListProps {
  currentUser: User;
}

export default function TaskList({ currentUser }: TaskListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "dueDate",
    sortOrder: "asc",
    status: undefined as Status | undefined,
    priority: undefined as Priority | undefined,
  });

  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      try {
        const response = await getTodos(filters);
        if (response.success) {
          setTodos(response.data);
        } else {
          toast.error("Failed to load tasks");
        }
      } catch {
        toast.error("Error loading tasks");
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, [filters]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddTodo = async (todoData: FormData) => {
    try {
      const response = await createTodo(todoData);
      if (response.success) {
        setTodos((prev) => [...prev, response.data]);
        toast.success("Todo added successfully");
        setShowAddTodo(false);
      }
    } catch {
      toast.error("Error adding task");
    }
  };

  const handleEditTodo = async (id: number, updateData: Partial<Todo>) => {
    try {
      const response = await updateTodo(id, updateData);
      if (response.success) {
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? { ...todo, ...response.data } : todo
          )
        );
        toast.success("Task updated");
      }
    } catch {
      toast.error("Error updating task");
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await deleteTodo(id);
      if (response.success) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
        toast.success("Task deleted");
      }
    } catch {
      toast.error("Error deleting task");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search tasks..."
          onChange={handleSearchChange}
          className="w-1/3"
        />
        <div className="flex items-center gap-2">
          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, sortBy: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="createdAt">Created At</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                status: value as Status | undefined,
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Status.TODO}>Todo</SelectItem>
              <SelectItem value={Status.DONE}>Done</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select
            value={filters.priority}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                priority: value as Priority | undefined,
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Priority.HIGH}>High</SelectItem>
              <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
              <SelectItem value={Priority.LOW}>Low</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setShowAddTodo(true)} variant="secondary">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              currentUser={currentUser}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>
      )}

      <Dialog open={showAddTodo} onOpenChange={setShowAddTodo}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Todo</DialogTitle>
          </DialogHeader>
          <AddTodoForm onAdd={handleAddTodo} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
