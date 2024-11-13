import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Priority, Role, Status, Todo } from "@/types";
import React, { useState } from "react";

interface AddTodoFormProps {
  onAdd: (todo: Todo) => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTodo: Todo = {
      id: Date.now(),
      title,
      description,
      dueDate,
      priority,
      status: Status.TODO,
      attachment: attachment ? attachment.name : null,
      filePath: attachment ? URL.createObjectURL(attachment) : null,
      owner: {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: Role.ADMIN,
        avatar: null,
      },
    };

    onAdd(newTodo);

    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority(Priority.MEDIUM);
    setAttachment(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <Select
        value={priority}
        onValueChange={(value) => setPriority(value as Priority)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={Priority.HIGH}>High</SelectItem>
          <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
          <SelectItem value={Priority.LOW}>Low</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            setAttachment(e.target.files[0]);
          }
        }}
      />
      <Button type="submit">Add Todo</Button>
    </form>
  );
};

export default AddTodoForm;
