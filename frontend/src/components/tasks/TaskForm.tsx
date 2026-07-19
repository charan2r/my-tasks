import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/store";
import { createTask } from "../../services/tasks/taskSlice";
import { TaskPriority } from "../../services/tasks/taskService";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Calendar, AlignLeft, AlertCircle, Plus } from "lucide-react";
import toast from "react-hot-toast";

export const TaskForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isMutating } = useSelector((state: RootState) => state.tasks);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
  }>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const { title, description, priority, dueDate } = formData;

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 4) {
      toast.error("Task title must contain at least 4 characters");
      return;
    }
    if (!dueDate) {
      toast.error("Due date is required");
      return;
    }
    try {
      await dispatch(createTask({ ...formData, status: "pending" })).unwrap();
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
      });
      toast.success("Task created");
    } catch {}
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Plus className="h-5 w-5 text-primary" />
        Create New Task
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div className="md:col-span-12">
          <Input
            name="title"
            value={title}
            onChange={onChange}
            placeholder="What needs to be done?"
            className="text-lg py-6"
            autoComplete="off"
            minLength={4}
            maxLength={100}
            required
          />
        </div>

        <div className="md:col-span-12">
          <div className="flex flex-col gap-1.5 w-full">
            <div className="relative">
              <div className="absolute top-3 left-3 text-muted-foreground pointer-events-none">
                <AlignLeft className="h-5 w-5" />
              </div>
              <textarea
                name="description"
                value={description}
                onChange={onChange}
                placeholder="Add some details... (optional)"
                className="flex w-full rounded-xl border border-input bg-card px-4 py-3 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-y"
                maxLength={1000}
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-6 lg:col-span-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-muted-foreground" /> Priority
            </label>
            <select
              name="priority"
              value={priority}
              onChange={onChange}
              className="flex h-11 w-full rounded-xl border border-input bg-card px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-6 lg:col-span-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" /> Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={dueDate}
              onChange={onChange}
              className="flex h-11 w-full rounded-xl border border-input bg-card px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
              required
            />
          </div>
        </div>

        <div className="md:col-span-12 lg:col-span-4 flex items-end mt-2 lg:mt-0">
          <Button type="submit" className="w-full h-11" isLoading={isMutating}>
            Add Task
          </Button>
        </div>
      </div>
    </form>
  );
};
