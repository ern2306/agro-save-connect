import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Leaf, Phone } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newUser = {
        id: `user_${Date.now()}`,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        address: "",
        avatar: "👤",
        accountNumber: `AGS${Math.floor(Math.random() * 10000000000)}`,
      };

      setCurrentUser(newUser);
      localStorage.setItem("agrosave_user", JSON.stringify(newUser));
      toast.success("Account created successfully!");
      navigate("/explore", { replace: true });
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">AgroSave</h1>
          </div>
          <p className="text-sm text-muted-foreground">Create your account</p>
        </div>

        <form onSubmit={handleRegister} className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-foreground mb-1">Join AgroSave</h2>
          <p className="text-xs text-muted-foreground mb-6">Start connecting with local farmers today</p>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border ${
                  errors.username ? "border-destructive" : "border-border"
                } text-sm focus:outline-none focus:ring-2 focus:ring-primary/30`}
              />
            </div>
            {errors.username && <p className="text-xs text-destructive mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border ${
                  errors.email ? "border-destructive" : "border-border"
                } text-sm focus:outline-none focus:ring-2 focus:ring-primary/30`}
              />
            </div>
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+60123456789"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border ${
                  errors.phone ? "border-destructive" : "border-border"
                } text-sm focus:outline-none focus:ring-2 focus:ring-primary/30`}
              />
            </div>
            {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border ${
                  errors.password ? "border-destructive" : "border-border"
                } text-sm focus:outline-none focus:ring-2 focus:ring-primary/30`}
              />
            </div>
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border ${
                  errors.confirmPassword ? "border-destructive" : "border-border"
                } text-sm focus:outline-none focus:ring-2 focus:ring-primary/30`}
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 mt-6"
          >
            {isLoading ? "Creating account..." : <>Create Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
