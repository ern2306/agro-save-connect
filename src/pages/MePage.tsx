import { useNavigate } from "react-router-dom";
import {
  User,
  Wallet,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  Settings,
  HelpCircle,
  Info,
  Globe,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Language } from "@/lib/i18n";

const MePage = () => {
  const navigate = useNavigate();
  const { currentUser, walletBalance, language, setLanguage, t } = useApp();

  const menuItems = [
    { icon: User, label: t("profile"), path: "/profile" },
    {
      icon: Wallet,
      label: t("wallet"),
      path: "/wallet",
      extra: `RM ${walletBalance.toFixed(2)}`,
    },
    { icon: Package, label: t("my_listings"), path: "/my-listings" },
    { icon: MapPin, label: t("community_map"), path: "/community-map" },
  ];

  const settingItems = [
    { icon: Settings, label: t("settings"), path: "/settings" },
    { icon: HelpCircle, label: t("help_center"), path: "/help" },
    { icon: Info, label: t("about_us"), path: "/about" },
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "ms", label: "Melayu", flag: "🇲🇾" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header / Profile Summary */}
      <div className="bg-primary pt-12 pb-8 px-6 rounded-b-[3rem] shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-3xl shadow-inner">
            {currentUser.avatar}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">
              {currentUser.username}
            </h1>
            <p className="text-white/70 text-sm">{currentUser.email}</p>
            <button
              onClick={() => navigate("/profile")}
              className="mt-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold text-white transition-colors border border-white/10"
            >
              {t("edit_profile")}
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-4">
        {/* Main Menu */}
        <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between p-4 active:bg-muted/50 transition-colors ${
                index !== menuItems.length - 1
                  ? "border-b border-border/50"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold text-sm text-foreground">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {item.extra && (
                  <span className="text-xs font-bold text-primary">
                    {item.extra}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>

        {/* Language Selection Section */}
        <div className="bg-card rounded-3xl shadow-sm border border-border p-4">
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-500" />
            </div>
            <span className="font-semibold text-sm text-foreground">
              {t("language")}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex flex-col items-center gap-1 py-3 rounded-2xl border transition-all ${
                  language === lang.code
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-background border-border hover:border-primary/30"
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span
                  className={`text-[10px] font-bold ${
                    language === lang.code
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {lang.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings & Help */}
        <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
          {settingItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between p-4 active:bg-muted/50 transition-colors ${
                index !== settingItems.length - 1
                  ? "border-b border-border/50"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="font-medium text-sm text-foreground">
                  {item.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center gap-3 p-4 bg-red-500/5 hover:bg-red-500/10 rounded-3xl border border-red-500/10 text-red-500 transition-colors mb-6"
        >
          <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm">{t("logout")}</span>
        </button>
      </div>
    </div>
  );
};

export default MePage;
