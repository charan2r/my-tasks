import React from "react";
import { Search } from "lucide-react";

interface TaskSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const TaskSearch: React.FC<TaskSearchProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="flex h-10 w-full items-center gap-2 rounded-xl border border-input bg-card px-3 ring-offset-background focus-within:ring-2 focus-within:ring-ring sm:max-w-xs">
      <Search
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-muted-foreground"
      />
      <input
        type="text"
        aria-label="Search tasks"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
};
