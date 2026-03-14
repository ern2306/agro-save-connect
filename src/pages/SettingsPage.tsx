import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  MapPin,
  Bell,
  Lock,
  ChevronRight,
  Shield,
  Eye,
  Trash2,
  Smartphone,
  X,
  Key,
  ShieldCheck,
  UserX,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const SettingsPage = () => {
  const { t } = useApp();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      document.documentElement.classList.contains("dark")
    );
  });
  const [isLiveLocation, setIsLiveLocation] = useState(true);
  const [isNotifications, setIsNotifications] = useState(true);

  // Modal states
  const [activeModal, setActiveModal] = useState<
    "password" | "privacy" | "blocked" | null
  >(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    toast.success(!isDarkMode ? "Dark Mode Enabled" : "Light Mode Enabled");
  };

  const handleClearCache = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: "Analyzing storage...",
      success: "12.4MB Cache cleared successfully!",
      error: "Failed to clear cache",
    });
  };

  const handleDevicePermissions = () => {
    toast.info("System Permissions", {
      description: "Camera: Allowed, Location: Allowed, Storage: Allowed",
    });
  };

  const Modal = ({
    title,
    children,
    onClose,
  }: {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 pb-10 sm:pb-6 animate-in slide-in-from-bottom duration-500 shadow-2xl border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  const sections = [
    {
      title: "App Settings",
      items: [
        {
          icon: isDarkMode ? Moon : Sun,
          label: "Dark Mode",
          type: "toggle",
          value: isDarkMode,
          action: toggleDarkMode,
          color: isDarkMode
            ? "text-primary bg-primary/10"
            : "text-amber-500 bg-amber-500/10",
        },
        {
          icon: MapPin,
          label: "Live Location",
          type: "toggle",
          value: isLiveLocation,
          action: () => setIsLiveLocation(!isLiveLocation),
          color: "text-blue-500 bg-blue-500/10",
        },
        {
          icon: Bell,
          label: "Push Notifications",
          type: "toggle",
          value: isNotifications,
          action: () => setIsNotifications(!isNotifications),
          color: "text-rose-500 bg-rose-500/10",
        },
      ],
    },
    {
      title: "Security & Privacy",
      items: [
        {
          icon: Lock,
          label: "Change Password",
          type: "link",
          action: () => setActiveModal("password"),
          color: "text-emerald-500 bg-emerald-500/10",
        },
        {
          icon: Shield,
          label: "Privacy Policy",
          type: "link",
          action: () => setActiveModal("privacy"),
          color: "text-indigo-500 bg-indigo-500/10",
        },
        {
          icon: Eye,
          label: "Blocked Users",
          type: "link",
          action: () => setActiveModal("blocked"),
          color: "text-gray-500 bg-gray-500/10",
        },
      ],
    },
    {
      title: "Advanced Features",
      items: [
        {
          icon: Smartphone,
          label: "Device Permissions",
          type: "link",
          action: handleDevicePermissions,
          color: "text-orange-500 bg-orange-500/10",
        },
        {
          icon: Trash2,
          label: "Clear Cache",
          type: "button",
          action: handleClearCache,
          color: "text-red-500 bg-red-500/10",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-10 transition-colors duration-300">
      <PageHeader title={t("settings")} showBack />

      <div className="px-4 py-6 space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
              {section.title}
            </h3>
            <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm transition-colors duration-300">
              {section.items.map((item, idx) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between p-4 ${
                    idx !== section.items.length - 1
                      ? "border-b border-border/50"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300 ${item.color}`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-foreground transition-colors duration-300">
                      {item.label}
                    </span>
                  </div>
                  {item.type === "toggle" ? (
                    <button
                      onClick={item.action}
                      className={`w-11 h-6 rounded-full transition-all duration-300 relative ${
                        item.value ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${
                          item.value ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  ) : (
                    <button
                      onClick={item.action}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Change Password Modal */}
      {activeModal === "password" && (
        <Modal title="Change Password" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-muted/50 border border-border rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                New Password
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-muted/50 border border-border rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <button
              onClick={() => {
                toast.success("Password updated successfully!");
                setActiveModal(null);
              }}
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all mt-4"
            >
              Update Password
            </button>
          </div>
        </Modal>
      )}

      {/* Privacy Policy Modal */}
      {activeModal === "privacy" && (
        <Modal title="Privacy Policy" onClose={() => setActiveModal(null)}>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <p className="text-xs text-foreground leading-relaxed font-medium">
                Your privacy is our priority. We use end-to-end encryption for
                all messages and payments.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">
                1. Data Collection
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We collect your location to match you with nearby farmers and
                delivery services. This data is never sold to third parties.
              </p>
              <h4 className="text-sm font-bold text-foreground">
                2. Usage Tracking
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Usage data helps us improve the AI Pest Detection tool and
                optimize food distribution routes.
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Blocked Users Modal */}
      {activeModal === "blocked" && (
        <Modal title="Blocked Users" onClose={() => setActiveModal(null)}>
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <UserX className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No Blocked Users
            </p>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              Users you block will appear here. They won't be able to message
              you or see your listings.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SettingsPage;
