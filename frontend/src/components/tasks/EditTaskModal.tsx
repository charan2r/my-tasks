import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { Task, updateTask } from '../../services/tasks/taskSlice';
import { AppDispatch } from '../../lib/store';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import toast from 'react-hot-toast';

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    status: task.status,
  });

  const { title, description, priority, dueDate, status } = formData;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 4) {
      toast.error('Task title must contain at least 4 characters');
      return;
    }
    if (!dueDate) {
      toast.error('Due date is required');
      return;
    }
    try {
      await dispatch(updateTask({ taskId: task.id, taskData: formData })).unwrap();
      toast.success('Task updated');
      onClose();
    } catch {
      // The dashboard displays the API error stored by the task slice.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Edit Task</h2>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={title}
            onChange={onChange}
            autoFocus
            minLength={4}
            maxLength={100}
            required
          />
          
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-foreground ml-1">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={onChange}
              className="flex w-full rounded-xl border border-input bg-card px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-y"
              maxLength={1000}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground ml-1">Priority</label>
              <select
                name="priority"
                value={priority}
                onChange={onChange}
                className="flex h-11 w-full rounded-xl border border-input bg-card px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground ml-1">Due Date</label>
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

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground ml-1">Status</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="pending"
                  checked={status === 'pending'}
                  onChange={onChange}
                  className="text-primary focus:ring-primary h-4 w-4"
                />
                Pending
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  checked={status === 'completed'}
                  onChange={onChange}
                  className="text-primary focus:ring-primary h-4 w-4"
                />
                Completed
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
