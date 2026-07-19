import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckSquare } from "lucide-react";
import { register, reset } from "../services/auth/authSlice";
import { AppDispatch, RootState } from "../lib/store";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { name, email, password, confirmPassword } = formData;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    dispatch(register({ name, email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl border border-border">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary text-primary-foreground p-3 rounded-xl mb-4 shadow-sm">
            <CheckSquare className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Create an account
          </h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <Input
            label="Full name"
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="John Doe"
            autoComplete="name"
            minLength={4}
            maxLength={20}
            required
          />
          <Input
            label="Email address"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={50}
            required
          />
          <Input
            label="Password"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            autoComplete="new-password"
            minLength={8}
            maxLength={20}
            required
            placeholder="••••••••"
          />
          <Input
            label="Confirm password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            autoComplete="new-password"
            minLength={8}
            maxLength={20}
            required
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Sign Up
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
