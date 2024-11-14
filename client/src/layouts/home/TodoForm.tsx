import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { CalendarIcon, Loader2, PaperclipIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Priority } from "@/types";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters" })
    .max(100, { message: "Title must be at most 100 characters" }),
  description: z
    .string()
    .min(5, { message: "Provide a longer description" })
    .max(500, { message: "Description must be at most 500 characters" }),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  priority: z.nativeEnum(Priority),
});

export type TodoFormData = z.infer<typeof formSchema>;

interface TodoFormProps {
  initialData?: TodoFormData;
  onSubmit: (data: TodoFormData, file?: File) => Promise<void>;
  isEdit?: boolean;
  isLoading?: boolean;
}

export default function TodoForm({
  initialData,
  onSubmit,
  isEdit = false,
  isLoading = false,
}: TodoFormProps) {
  const [file, setFile] = useState<File | undefined>(undefined);

  const form = useForm<TodoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: Priority.MEDIUM,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      // Note: File cannot be prefilled for security reasons
    }
  }, [initialData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 5MB limit.");
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleFileRemove = () => {
    setFile(undefined);
  };

  const handleFormSubmit = async (values: TodoFormData) => {
    if (isEdit) {
      await onSubmit(values);
    } else {
      await onSubmit(values, file);
    }
    if (!isEdit) {
      form.reset();
      setFile(undefined);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4 p-4"
      >
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormControl>
                <Input
                  id="title"
                  placeholder="Enter todo title"
                  disabled={isLoading}
                  {...field}
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <Textarea
                  id="description"
                  placeholder="Enter todo description"
                  disabled={isLoading}
                  {...field}
                  className="h-20 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Priority and Due Date Fields */}
        <div className="flex gap-4">
          {/* Priority Field */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel htmlFor="priority">Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Priority.HIGH}>High</SelectItem>
                    <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={Priority.LOW}>Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Due Date Field */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel htmlFor="dueDate">Due Date</FormLabel>
                <FormControl>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="dueDate"
                      type="date"
                      className="pl-10 h-10"
                      min={new Date().toISOString().split("T")[0]}
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Attachment Field (Only for Adding) */}
        {!isEdit && (
          <FormItem>
            <FormLabel htmlFor="file">Attachment</FormLabel>
            <FormControl>
              <div className="flex items-center space-x-3">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                />
                {file && (
                  <div className="flex items-center space-x-2">
                    <PaperclipIcon className="h-4 w-4 text-gray-500" />
                    <span
                      className="text-xs truncate max-w-[120px] hover:text-ellipsis overflow-hidden"
                      title={file.name} // Full filename on hover
                    >
                      {file.name.length > 15
                        ? `${file.name.slice(0, 12)}...`
                        : file.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleFileRemove}
                      className="h-6 w-6"
                    >
                      <TrashIcon className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full h-10" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Saving Changes..." : "Adding Todo..."}
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Add Todo"
          )}
        </Button>
      </form>
    </Form>
  );
}
