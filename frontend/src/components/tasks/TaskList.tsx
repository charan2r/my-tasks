import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../lib/store';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../common/EmptyState';
import { Loader } from '../common/Loader';
import { CheckCircle2, ListTodo } from 'lucide-react';

interface TaskListProps {
  searchTerm: string;
}

export const TaskList: React.FC<TaskListProps> = ({ searchTerm }) => {
  const { tasks, filter, isLoading } = useSelector((state: RootState) => state.tasks);

  if (isLoading && tasks.length === 0) {
    return (
      <div className="py-12 flex justify-center">
        <Loader size={32} />
      </div>
    );
  }

  let filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term))
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        description="Add a task above to get started organizing your day."
        icon={<ListTodo className="h-10 w-10 text-primary/60" />}
      />
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <EmptyState
        title="No matches found"
        description="Try adjusting your search or filter to find what you're looking for."
        icon={<CheckCircle2 className="h-10 w-10 text-muted-foreground/50" />}
      />
    );
  }

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
