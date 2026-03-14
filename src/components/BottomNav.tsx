import { useLocation, useNavigate } from "react-router-dom";
import { Search, Bug, PlusCircle, Bell, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useApp();

  const tabs = [
    { path: "/explore", icon: Search, label: t("explore") },
    { path: "/pest-detect", icon: Bug, label: t("pest_detect") },
    { path: "/add-listing", icon: PlusCircle, label: t("sell") },
    { path: "/notifications", icon: Bell, label: t("notifications") },
    { path: "/me", icon: t("me"), label: t("me") }, // Fix: the icon field was being used for label in some places, but let's keep it consistent
  ];

  // Adjusting the tabs array to correctly use icons
  const correctedTabs = [
    { path: "/explore", icon: Search, label: t("explore") },
    { path: "/pest-detect", icon: Bug, label: t("pest_detect") },
    { path: "/add-listing", icon: PlusCircle, label: t("sell") },
    { path: "/notifications", icon: Bell, label: t("notifications") },
    { path: "/me", icon: User, label: t("me") },
  ];

  // Hide on splash, login, and some sub-pages
  const hideOn = ["/", "/splash", "/login"];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {correctedTabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);
          const Icon = tab.icon;
          const isAdd = tab.path === "/add-listing";
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isAdd ? "relative -top-3" : ""
              }`}
            >
              {isAdd ? (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
              ) : (
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-primary" : "text-nav-inactive"
                  }`}
                />
              )}
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-nav-inactive"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
