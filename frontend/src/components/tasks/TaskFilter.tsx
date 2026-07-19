import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/store';
import { setFilter } from '../../services/tasks/taskSlice';

export const TaskFilter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { filter } = useSelector((state: RootState) => state.tasks);

  const filters: { label: string; value: 'all' | 'pending' | 'completed' }[] = [
    { label: 'All Tasks', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="flex p-1 bg-secondary/50 rounded-xl w-full sm:w-auto overflow-x-auto border border-border/50">
      {filters.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => dispatch(setFilter(value))}
          className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
            filter === value
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
