import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Users,
  Star,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/appwrite/auth";
import { getCurrentUser } from "@/appwrite/auth";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

// Step 1 — define shape of form data
interface LoginForm {
  email: string;
  password: string;
}

function LoginPage() {
  // State for show/hide password
  const [showPassword, setShowPassword] = useState(false);

  // State for loading during form submit
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  // Form submit handler
  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      const user = await getCurrentUser();
      if (user) {
        setUser(user);
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Full screen container — flex row
    <div className="flex h-screen">
      {/* ===== LEFT SIDE ===== */}
      <div
        className="hidden lg:flex w-1/2 relative overflow-hidden
                            bg-gradient-to-br from-violet-900 via-purple-900 to-cyan-900
                            flex-col items-center justify-center p-12"
      >
        {/* Gradient blobs for background effect */}
        <div
          className="absolute top-20 left-20 w-72 h-72 bg-violet-500
                                opacity-20 rounded-full blur-3xl"
        />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500
                                opacity-20 rounded-full blur-3xl"
        />

        {/* Content — above blobs */}
        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl
                                        flex items-center justify-center"
            >
              <div
                className="w-0 h-0
                                border-l-[8px] border-l-transparent
                                border-r-[8px] border-r-transparent
                                border-b-[14px] border-b-white"
              />
            </div>
            <span className="text-3xl font-bold text-white">NovaDash</span>
          </div>

          {/* Tagline */}
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your tasks. Your stories.
            <br />
            One dashboard.
          </h1>

          {/* Stat badges */}
          <div className="flex flex-col items-center gap-3 mt-10">
            <div className="flex gap-3">
              <StatBadge icon={<Users size={16} />} label="12k+ Users" />
              <StatBadge icon={<Star size={16} />} label="4.9★ Rating" />
            </div>

            <StatBadge
              icon={<CheckCircle size={16} />}
              label="50k Tasks Done"
            />
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE ===== */}
      <div
        className="flex-1 flex items-center justify-center
                            bg-background p-8"
      >
        {/* Card */}
        <div
          className="w-full max-w-md bg-card border border-border
                                rounded-2xl p-8 shadow-2xl"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm">
              Sign in to manage your premium workspace
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="flex gap-3 mb-6">
            <Button
              variant="outline"
              className="flex-1 border-border hover:border-violet-500"
              type="button"
            >
              <img
                src="https://www.google.com/favicon.ico"
                className="w-4 h-4 mr-2"
                alt="Google"
              />
              Google
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-border hover:border-violet-500"
              type="button"
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.31
                                3.435 9.795 8.205 11.385.6.105.825-.255.825
                                -.57 0-.285-.015-1.23-.015-2.235-3.015.555
                                -3.795-.735-4.035-1.41-.135-.345-.72-1.41
                                -1.23-1.695-.42-.225-1.02-.78-.015-.795.945
                                -.015 1.62.87 1.845 1.23 1.08 1.815 2.805
                                1.305 3.495.99.105-.78.42-1.305.765-1.605
                                -2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465
                                -2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0
                                0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3
                                -.405s2.04.135 3 .405c2.295-1.56 3.3-1.23
                                3.3-1.23.66 1.65.24 2.88.12 3.18.765.84
                                1.23 1.905 1.23 3.225 0 4.605-2.805 5.625
                                -5.475 5.925.435.375.81 1.095.81 2.22 0
                                1.605-.015 2.895-.015 3.3 0 .315.225.69.825
                                .57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12
                                -12-12z"
                />
              </svg>
              GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span
              className="text-xs text-muted-foreground
                                        uppercase tracking-widest"
            >
              or continue with email
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1">
              <label
                className="text-xs font-medium
                                             text-muted-foreground uppercase
                                             tracking-wider"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2
                                                -translate-y-1/2 w-4 h-4
                                                text-muted-foreground"
                />
                <Input
                  type="email"
                  placeholder="alex@example.com"
                  className="pl-10 bg-background border-border
                                               focus:border-violet-500"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  className="text-xs font-medium
                                                 text-muted-foreground uppercase
                                                 tracking-wider"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-violet-400
                                               hover:text-violet-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2
                                                -translate-y-1/2 w-4 h-4
                                                text-muted-foreground"
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-background
                                               border-border focus:border-violet-500"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Min 8 characters",
                    },
                  })}
                />
                {/* Show/hide toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2
                                               -translate-y-1/2 text-muted-foreground
                                               hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-violet-600
                                       to-cyan-500 hover:from-violet-500
                                       hover:to-cyan-400 text-white font-semibold
                                       h-11 rounded-xl border-0"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Signup link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? &nbsp; {"   "}
            <Link
              to="/signup"
              className="text-violet-400 hover:text-violet-300
                                       font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Small reusable badge component
function StatBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm
                        border border-white/20 rounded-xl px-4 py-2"
    >
      <span className="text-cyan-400">{icon}</span>
      <span className="text-white text-sm font-medium">{label}</span>
    </div>
  );
}

export default LoginPage;
