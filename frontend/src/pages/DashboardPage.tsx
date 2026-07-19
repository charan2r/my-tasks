import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { CheckCircle2, CircleDashed, ListTodo } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { TaskFilter } from "../components/tasks/TaskFilter";
import { TaskForm } from "../components/tasks/TaskForm";
import { TaskList } from "../components/tasks/TaskList";
import { TaskSearch } from "../components/tasks/TaskSearch";
import { AppDispatch, RootState } from "../lib/store";
import { getTasks, resetStatus } from "../services/tasks/taskSlice";

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { tasks, isError, message } = useSelector(
    (state: RootState) => state.tasks,
  );

  useEffect(() => {
    void dispatch(getTasks());
  }, [dispatch]);

  useEffect(() => {
    if (!isError) return;
    toast.error(message);
    dispatch(resetStatus());
  }, [dispatch, isError, message]);

  const counts = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((task) => task.status === "pending").length,
      completed: tasks.filter((task) => task.status === "completed").length,
    }),
    [tasks],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-sm font-medium text-primary">Task dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">
            Welcome, {user?.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Plan your work, track progress, and keep every deadline visible.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3" aria-label="Task summary">
          {[
            { label: "All tasks", value: counts.total, icon: ListTodo },
            { label: "Pending", value: counts.pending, icon: CircleDashed },
            { label: "Completed", value: counts.completed, icon: CheckCircle2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
                </div>
                <Icon className="h-7 w-7 text-primary" />
              </div>
            </div>
          ))}
        </section>

        <TaskForm />

        <section aria-labelledby="task-list-heading">
          <div className="flex flex-col gap-4 mb-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="task-list-heading" className="text-xl font-bold text-foreground">
              Your tasks
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <TaskSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <TaskFilter />
            </div>
          </div>
          <TaskList searchTerm={searchTerm} />
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
