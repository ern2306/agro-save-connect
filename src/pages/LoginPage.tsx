import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Leaf, Fingerprint } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setCurrentUser, currentUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoLogin, setIsAutoLogin] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    if (currentUser?.id) {
      navigate("/explore", { replace: true });
      return;
    }

    // Try to restore user from localStorage
    const savedUser = localStorage.getItem("agrosave_user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user?.id) {
          setIsAutoLogin(true);
          setCurrentUser(user);
          toast.success("Welcome back!");
          navigate("/explore", { replace: true });
        }
      } catch (error) {
        console.error("Failed to restore user session:", error);
        localStorage.removeItem("agrosave_user");
      }
    }
  }, [currentUser?.id, navigate, setCurrentUser]);

  const handlePasskeyLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const johnFarmerUser = {
        id: "user1",
        username: "John Farmer",
        phone: "+60123456789",
        email: "john@agrosave.com",
        address: "123 Farm Road, Kuala Lumpur",
        avatar: "👨‍🌾",
        accountNumber: "AGS3847291056",
      };
      setCurrentUser(johnFarmerUser);
      localStorage.setItem("agrosave_user", JSON.stringify(johnFarmerUser));
      toast.success("Passkey login successful!");
      navigate("/explore", { replace: true });
      setIsLoading(false);
    }, 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const user = {
        id: `user_${Date.now()}`,
        username: email.split("@")[0],
        phone: "+60123456789",
        email: email,
        address: "123 Farm Road, Kuala Lumpur",
        avatar: "👤",
        accountNumber: `AGS${Math.floor(Math.random() * 10000000000)}`,
      };

      setCurrentUser(user);
      localStorage.setItem("agrosave_user", JSON.stringify(user));
      toast.success("Login successful!");
      navigate("/explore", { replace: true });
      setIsLoading(false);
    }, 1000);
  };

  if (isAutoLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex flex-col items-center justify-center px-4 py-6">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Leaf className="w-12 h-12 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Signing you in...</p>
        </div>
      </div>
    );
  }

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

        {/* Passkey Quick Login Button */}
        <button
          onClick={handlePasskeyLogin}
          disabled={isLoading}
          className="w-full mb-4 py-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors disabled:opacity-50"
        >
          <Fingerprint className="w-4 h-4" />
          {isLoading ? "Signing in..." : "Quick Login - John Farmer"}
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-gradient-to-br from-primary/5 via-background to-primary/5 text-muted-foreground">
              Or sign in with email
            </span>
          </div>
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

        {/* Sign Up Link */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-primary font-semibold hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 flex items-start gap-2 text-muted-foreground">
          <div className="text-lg">ℹ️</div>
          <p className="text-[10px] leading-relaxed">
            Demo passkey: john@agrosave.com / john123. You can also log in with any email and password. Your session will be saved automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
