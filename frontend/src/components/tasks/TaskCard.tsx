import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import {
  Task,
  updateTaskStatus,
  deleteTask,
} from "../../services/tasks/taskSlice";
import { AppDispatch } from "../../lib/store";
import { formatDate } from "../../utils/formatDate";
import { Button } from "../common/Button";
import { EditTaskModal } from "./EditTaskModal";

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isCompleted = task.status === "completed";

  const handleStatusToggle = () => {
    dispatch(
      updateTaskStatus({
        taskId: task.id,
        status: isCompleted ? "pending" : "completed",
      }),
    );
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(task.id));
    }
  };

  const priorityColors = {
    low: "bg-secondary text-secondary-foreground",
    medium:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    high: "bg-destructive/10 text-destructive",
  };

  return (
    <>
      <div
        className={`bg-card border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${isCompleted ? "border-border opacity-75" : "border-border/60"} group`}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={handleStatusToggle}
            className="mt-1 flex-shrink-0 text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
            aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-6 w-6 text-primary fill-primary/20" />
            ) : (
              <Circle className="h-6 w-6" />
            )}
          </button>

          <div className="flex-grow min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between mb-1">
              <h3
                className={`text-base font-semibold truncate ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}
              >
                {task.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${priorityColors[task.priority]}`}
                >
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)}
                </span>
                {task.status === "completed" && (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    Done
                  </span>
                )}
              </div>
            </div>

            {task.description && (
              <p
                className={`text-sm mb-4 line-clamp-2 ${isCompleted ? "text-muted-foreground/70" : "text-muted-foreground"}`}
              >
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center text-xs text-muted-foreground gap-4">
                {task.dueDate && (
                  <div className="flex items-center gap-1.5" title="Due Date">
                    <Calendar className="h-3.5 w-3.5" />
                    <span
                      className={
                        isCompleted
                          ? ""
                          : new Date(task.dueDate) < new Date()
                            ? "text-destructive font-medium"
                            : ""
                      }
                    >
                      Due:{formatDate(task.dueDate)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                  className="h-8 px-3 text-xs"
                >
                  <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditTaskModal
          task={task}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
};
