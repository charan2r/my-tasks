import { useSelector } from "react-redux";
import { CheckCircle2 } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { RootState } from "../lib/store";

const DashboardPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <CheckCircle2 className="h-10 w-10 text-primary mb-4" />
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {user?.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            You are ready to manage your tasks.
          </p>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
