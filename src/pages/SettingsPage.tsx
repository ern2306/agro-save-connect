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
  Loader2,
  MessageSquare,
  CheckCircle2,
  Info,
  LogOut,
  History,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const SettingsPage = () => {
  const {
    t,
    isDarkMode,
    setIsDarkMode,
    blockedUserIds,
    setBlockedUserIds,
    listings,
    currentUser,
  } = useApp();
  const navigate = useNavigate();

  // Local states for settings
  const [isLiveLocation, setIsLiveLocation] = useState(
    () => localStorage.getItem("live_location") !== "false"
  );
  const [isNotifications, setIsNotifications] = useState(
    () => localStorage.getItem("push_notifications") === "true"
  );
  const [showAIChat, setShowAIChat] = useState(
    () => localStorage.getItem("show_ai_chat") !== "false"
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal states
  const [activeModal, setActiveModal] = useState<
    "password" | "privacy" | "blocked" | "device" | "cache" | null
  >(null);

  // Cache items state
  const [cacheItems, setCacheItems] = useState([
    {
      id: "img",
      label: "Image Cache",
      size: "8.4 MB",
      desc: "Cached product and profile images",
    },
    {
      id: "search",
      label: "Search History",
      size: "0.2 MB",
      desc: "Your recent search queries",
    },
    {
      id: "temp",
      label: "Temporary Data",
      size: "3.8 MB",
      desc: "App state and session data",
    },
  ]);

  // Device Info
  const [deviceInfo, setDeviceInfo] = useState({
    browser: "Loading...",
    os: "Loading...",
    screen: "Loading...",
    language: "Loading...",
    location: "Kuala Lumpur, Malaysia", // Mock login location
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    let browser = "Unknown Browser";
    if (ua.includes("Chrome")) browser = "Google Chrome";
    else if (ua.includes("Firefox")) browser = "Mozilla Firefox";
    else if (ua.includes("Safari")) browser = "Apple Safari";
    else if (ua.includes("Edge")) browser = "Microsoft Edge";

    let os = "Unknown OS";
    if (ua.includes("Win")) os = "Windows";
    else if (ua.includes("Mac")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone")) os = "iOS";

    setDeviceInfo((prev) => ({
      ...prev,
      browser,
      os,
      screen: `${window.screen.width} x ${window.screen.height}`,
      language: navigator.language,
    }));
  }, []);

  // Persist settings
  useEffect(() => {
    localStorage.setItem("live_location", String(isLiveLocation));
  }, [isLiveLocation]);

  useEffect(() => {
    localStorage.setItem("show_ai_chat", String(showAIChat));
    // Dispatch custom event to notify AIChatWidget
    window.dispatchEvent(new Event("storage"));
  }, [showAIChat]);

  useEffect(() => {
    localStorage.setItem("push_notifications", String(isNotifications));
  }, [isNotifications]);

  // Find blocked user names for display
  const blockedUsers = blockedUserIds.map((id) => {
    const listing = listings.find((l) => l.sellerId === id);
    return { id, name: listing?.seller || `User ${id}` };
  });

  const handleUnblock = (id: string) => {
    setBlockedUserIds((prev) => prev.filter((uid) => uid !== id));
    toast.success("User unblocked");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    toast.success(!isDarkMode ? "Dark Mode Enabled" : "Light Mode Enabled");
  };

  const handleClearCache = (id: string, label: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCacheItems((prev) => prev.filter((item) => item.id !== id));
      toast.success(`${label} cleared successfully!`);
    }, 1200);
  };

  const handleClearAllCache = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCacheItems([]);
      toast.success("All cache cleared successfully!");
    }, 2000);
  };

  const handlePushNotificationToggle = async () => {
    if (!isNotifications) {
      // Requesting permission
      toast.promise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            setIsNotifications(true);
            resolve(true);
          }, 1500);
        }),
        {
          loading: "Requesting push permission...",
          success: "Push notifications enabled!",
          error: "Permission denied",
        }
      );
    } else {
      setIsNotifications(false);
      toast.info("Push notifications disabled");
    }
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
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300 p-4">
      <div className="bg-card w-full max-w-md rounded-[2.5rem] p-6 pb-10 sm:pb-6 animate-in slide-in-from-bottom duration-500 shadow-2xl border border-border/50">
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
          action: () => {
            setIsLiveLocation(!isLiveLocation);
            toast.success(
              isLiveLocation
                ? "Live Location Disabled"
                : "Live Location Enabled"
            );
          },
          color: "text-blue-500 bg-blue-500/10",
        },
        {
          icon: Bell,
          label: "Push Notifications",
          type: "toggle",
          value: isNotifications,
          action: handlePushNotificationToggle,
          color: "text-rose-500 bg-rose-500/10",
        },
        {
          icon: MessageSquare,
          label: "AI Chat Widget",
          type: "toggle",
          value: showAIChat,
          action: () => {
            setShowAIChat(!showAIChat);
            toast.success(!showAIChat ? "AI Chat Enabled" : "AI Chat Disabled");
          },
          color: "text-primary bg-primary/10",
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
          icon: UserX,
          label: "Blocked Users",
          type: "link",
          value: blockedUserIds.length > 0 ? `${blockedUserIds.length}` : "",
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
          action: () => setActiveModal("device"),
          color: "text-orange-500 bg-orange-500/10",
        },
        {
          icon: Trash2,
          label: "Clear Cache",
          type: "link",
          action: () => setActiveModal("cache"),
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
                  <div className="flex items-center gap-3">
                    {item.value !== undefined &&
                      typeof item.value === "string" && (
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                          {item.value}
                        </span>
                      )}
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
          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
            {blockedUsers.length > 0 ? (
              blockedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-xl shadow-sm">
                      👨‍🌾
                    </div>
                    <span className="font-bold text-sm">{user.name}</span>
                  </div>
                  <button
                    onClick={() => handleUnblock(user.id)}
                    className="px-4 py-2 bg-primary/10 text-primary text-xs font-black rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    UNBLOCK
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <UserX className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No Blocked Users
                </p>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  Users you block will appear here. They won't be able to
                  message you or see your listings.
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Device Permissions Modal */}
      {activeModal === "device" && (
        <Modal title="Device Permissions" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="w-6 h-6 text-primary" />
                <h4 className="font-bold text-sm">Current Device Info</h4>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Browser", value: deviceInfo.browser },
                  { label: "Operating System", value: deviceInfo.os },
                  { label: "Screen Resolution", value: deviceInfo.screen },
                  { label: "System Language", value: deviceInfo.language },
                ].map((info) => (
                  <div
                    key={info.label}
                    className="flex justify-between items-center"
                  >
                    <span className="text-xs text-muted-foreground">
                      {info.label}
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {info.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted/30 border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <History className="w-6 h-6 text-muted-foreground" />
                <h4 className="font-bold text-sm">Login History</h4>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{deviceInfo.location}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Current Session • Active Now
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-emerald-500 uppercase">
                  This Device
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">
                Manage Permissions
              </h4>
              {[
                { label: "Camera", status: "Allowed", icon: CheckCircle2 },
                { label: "Location", status: "Allowed", icon: CheckCircle2 },
                { label: "Storage", status: "Allowed", icon: CheckCircle2 },
                { label: "Microphone", status: "Ask Every Time", icon: Info },
              ].map((perm) => (
                <div
                  key={perm.label}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border"
                >
                  <span className="text-xs font-medium">{perm.label}</span>
                  <button
                    onClick={() =>
                      toast.info(`Managing ${perm.label} permissions...`)
                    }
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <perm.icon
                      className={`w-3.5 h-3.5 ${
                        perm.status === "Allowed"
                          ? "text-emerald-500"
                          : "text-amber-500"
                      }`}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {perm.status}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Clear Cache Modal */}
      {activeModal === "cache" && (
        <Modal title="Clear Cache" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-foreground leading-relaxed">
                Clearing cache will free up space but may cause some images to
                load slower next time.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">
                Suggested to Clear
              </h4>
              {cacheItems.length > 0 ? (
                cacheItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-muted/50 rounded-2xl border border-border flex items-center justify-between animate-in fade-in slide-in-from-right-4 duration-300"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{item.label}</span>
                        <span className="text-[10px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">
                          {item.size}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <button
                      onClick={() => handleClearCache(item.id, item.label)}
                      disabled={isProcessing}
                      className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  <p className="text-sm font-bold">Storage is clean!</p>
                  <p className="text-xs text-muted-foreground">
                    No cache items found.
                  </p>
                </div>
              )}
            </div>
            {cacheItems.length > 0 && (
              <button
                onClick={handleClearAllCache}
                disabled={isProcessing}
                className="w-full bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all mt-2 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Clear All Cache (12.4 MB)"
                )}
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SettingsPage;
