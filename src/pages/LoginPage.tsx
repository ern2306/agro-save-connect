import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Language } from "@/lib/i18n";
import {
  User,
  Lock,
  Globe,
  ArrowRight,
  Leaf,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t, setCurrentUser, currentUser } = useApp();

  useEffect(() => {
    const savedUser = localStorage.getItem("agro_user");
    if (savedUser) {
      navigate("/explore");
    }
  }, [navigate]);
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [username, setUsername] = useState("farmerjohn");
  const [password, setPassword] = useState("123456");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      if (!username || !password) {
        toast.error(t("enter_username"));
        return;
      }

      // Mock login
      const user = {
        id: "user1",
        username: username,
        phone: "+60123456789",
        email: "user@example.com",
        avatar: "👨‍🌾",
        address: "123 Farm Road, Kuala Lumpur",
      };

      setCurrentUser(user);
      localStorage.setItem("agro_user", JSON.stringify(user));
      toast.success(`${t("welcome_back")}, ${username}!`);
      navigate("/explore");
    } else {
      if (!username || !password || !email) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Mock sign up
      const newUser = {
        id: `user_${Date.now()}`,
        username,
        phone: phone || "+60123456789",
        email,
        avatar: "👨‍🌾",
        address: address || "Kuala Lumpur",
      };

      setCurrentUser(newUser);
      localStorage.setItem("agro_user", JSON.stringify(newUser));
      toast.success(`Account created successfully! Welcome, ${username}!`);
      navigate("/explore");
    }
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "ms", label: "Melayu", flag: "🇲🇾" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-12 pb-8">
      {/* Language Selector */}
      <div className="flex justify-end gap-2 mb-8">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              language === lang.code
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>

      {/* Logo & Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 shadow-inner">
          <Leaf className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
          AgroSave
        </h1>
        <p className="text-sm text-muted-foreground max-w-[240px]">
          {isLogin
            ? t("sign_in_to_continue")
            : "Create an account to start saving food"}
        </p>
      </div>

      {/* Auth Form */}
      <form onSubmit={handleAuth} className="space-y-4 flex-1">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
            {t("username")} *
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("enter_username")}
              className="w-full bg-card border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              required
            />
          </div>
        </div>

        {!isLogin && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Email *
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-card border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Phone Number
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full bg-card border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full bg-card border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("password")} *
            </label>
            {isLogin && (
              <button
                type="button"
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t("forgot_password")}
              </button>
            )}
          </div>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("enter_password")}
              className="w-full bg-card border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all mt-6"
        >
          {isLogin ? t("login") : t("sign_up")}
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {isLogin ? t("dont_have_account") : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-primary hover:underline"
          >
            {isLogin ? t("sign_up") : t("login")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
