import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Status, Priority } from "@/types";
import { RotateCcw } from "lucide-react";
interface FilterSectionProps {
  filters: {
    search: string;
    sortBy: string;
    sortOrder: string;
    status?: Status;
    priority?: Priority;
  };
  setFilters: Dispatch<
    SetStateAction<{
      search: string;
      sortBy: string;
      sortOrder: string;
      status?: Status;
      priority?: Priority;
    }>
  >;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  setFilters,
}) => {
  const resetFilters = () => {
    setFilters({
      search: "",
      sortBy: "dueDate",
      sortOrder: "asc",
      status: undefined,
      priority: undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <div className="bg-secondary/50 p-4 rounded-lg space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
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

          <Button
            variant="outline"
            size="icon"
            onClick={resetFilters}
            className="h-10 w-10"
            title="Reset Filters"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterSection;
