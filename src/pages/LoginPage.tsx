import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Leaf, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setCurrentUser({
        id: "user1",
        username: "John Farmer",
        phone: "+60123456789",
        email: email,
        address: "123 Farm Road, Kuala Lumpur",
        avatar: "👨‍🌾",
        accountNumber: "AGS3847291056",
      });
      toast.success("Login successful!");
      navigate("/explore", { replace: true });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">AgroSave</h1>
          </div>
          <p className="text-sm text-muted-foreground">Fresh from farm to you</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-1">Welcome Back</h2>
          <p className="text-xs text-muted-foreground mb-6">Sign in to your account</p>

          {/* Email Input */}
          <div className="mb-4">
            <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button className="text-primary font-semibold hover:underline">
              Create Account
            </button>
          </p>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 flex items-start gap-2 text-muted-foreground">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="text-[10px] leading-relaxed">
            This is a demo version of AgroSave Connect. You can log in with any email and password to explore the features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
