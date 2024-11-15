import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "@/services/todoService";
import { Priority, Status, Todo, User } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmptyIllustration from "../../components/shared/EmptyIllustration";
import FilterSection from "./FilterSection";
import TodoCard from "./TodoCard";
import TodoForm, { TodoFormData } from "./TodoForm";

interface TaskListProps {
  currentUser: User;
}

export default function TaskList({ currentUser }: TaskListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [showEditTodo, setShowEditTodo] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Adjust filters type for consistency
  const [filters, setFilters] = useState<{
    search: string;
    sortBy: string;
    sortOrder: string;
    status?: Status;
    priority?: Priority;
  }>({
    search: "",
    sortBy: "dueDate",
    sortOrder: "asc",
    status: undefined,
    priority: undefined,
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

  const handleAddTodo = async (todoData: TodoFormData, file?: File) => {
    setLoading(true);
    try {
      const response = await createTodo({ ...todoData, file });
      if (response.success) {
        // Optimistic update
        setTodos((prev) => [
          ...prev,
          {
            ...response.data,
            user: currentUser, // Attach current user details
          },
        ]);
        toast.success("Todo added successfully");
        setShowAddTodo(false);
      }
    } catch {
      toast.error("Error adding task");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTodo = async (id: number, updateData: TodoFormData) => {
    setLoading(true);
    try {
      const response = await updateTodo(id, updateData);
      if (response.success) {
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? { ...todo, ...response.data } : todo
          )
        );
        toast.success("Task updated");
        setShowEditTodo(false);
        setTodoToEdit(null);
      }
    } catch {
      toast.error("Error updating task");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDone = async (todo: Todo) => {
    try {
      const response = await updateTodo(todo.id, { status: Status.DONE });
      if (response.success) {
        setTodos((prev) =>
          prev.map((t) => (t.id === todo.id ? { ...t, ...response.data } : t))
        );
        toast.success("Task marked as done");
      }
    } catch {
      toast.error("Error marking task as done");
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

  const openEditModal = (todo: Todo) => {
    setTodoToEdit(todo);
    setShowEditTodo(true);
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-1/2 lg:w-1/3">
          <Input
            type="text"
            placeholder="Search tasks..."
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button
            onClick={() => setShowAddTodo(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <FilterSection filters={filters} setFilters={setFilters} />
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : todos.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-16">
          <EmptyIllustration />
          <h2 className="text-2xl font-semibold mb-2">No tasks found</h2>
          <p className="text-muted-foreground mb-4 text-center">
            Start by adding a new task or adjusting your filters.
          </p>
          <Button onClick={() => setShowAddTodo(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Your First Task
          </Button>
        </div>
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TodoCard
                todo={todo}
                currentUser={currentUser}
                onEdit={openEditModal}
                onMarkAsDone={handleMarkAsDone}
                onDelete={handleDeleteTodo}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={showAddTodo} onOpenChange={setShowAddTodo}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Todo</DialogTitle>
          </DialogHeader>
          <TodoForm onSubmit={handleAddTodo} isLoading={loading} />
        </DialogContent>
      </Dialog>

      {todoToEdit && (
        <Dialog open={showEditTodo} onOpenChange={setShowEditTodo}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Todo</DialogTitle>
            </DialogHeader>
            <TodoForm
              initialData={{
                title: todoToEdit.title,
                description: todoToEdit.description,
                dueDate: todoToEdit.dueDate,
                priority: todoToEdit.priority,
              }}
              onSubmit={async (data) => {
                await handleEditTodo(todoToEdit.id, data);
              }}
              isEdit={true}
              isLoading={loading}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
