import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  CheckCircle,
  XCircle,
  ShoppingBag,
  Truck,
  Heart,
  Bell,
  ChevronRight,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatDistanceToNow } from "date-fns";

const ALLOWED_SELLER_CROPS = ["cabbage", "kangkung", "broccoli"];

const NotificationsPage = () => {
  const { notifications, orders, currentUser, t } = useApp();
  const [tab, setTab] = useState<"buyer" | "seller">("buyer");
  const navigate = useNavigate();

  const buyerNotifs = notifications.filter((n) =>
    [
      "order_shipped",
      "order_confirmed",
      "order_cancelled",
      "donation",
      "blocked",
    ].includes(n.type)
  );

  const sellerNotifs = notifications.filter((n) => {
    if (
      !["new_order", "order_cancelled_seller", "order_preparing"].includes(
        n.type
      )
    ) {
      return false;
    }
    // Safe access to orderId
    const orderId = (n as any).orderId;
    if (!orderId) return false;

    const order = orders.find((o) => o.id === orderId);
    if (!order || order.buyerId === currentUser?.id) return false;
    const cropName = order.listing.name.toLowerCase();
    return ALLOWED_SELLER_CROPS.some((crop) => cropName.includes(crop));
  });

  const current = tab === "buyer" ? buyerNotifs : sellerNotifs;

  const getIconConfig = (type: string) => {
    switch (type) {
      case "order_shipped":
        return {
          icon: Truck,
          bg: "bg-blue-50 dark:bg-blue-950/30",
          color: "text-blue-600 dark:text-blue-400",
          label: "Shipped",
        };
      case "order_confirmed":
        return {
          icon: CheckCircle,
          bg: "bg-emerald-50 dark:bg-emerald-950/30",
          color: "text-emerald-600 dark:text-emerald-400",
          label: "Confirmed",
        };
      case "order_cancelled":
      case "order_cancelled_seller":
        return {
          icon: XCircle,
          bg: "bg-red-50 dark:bg-red-950/30",
          color: "text-red-500 dark:text-red-400",
          label: "Cancelled",
        };
      case "new_order":
        return {
          icon: ShoppingBag,
          bg: "bg-primary/10",
          color: "text-primary",
          label: "New Order",
        };
      case "order_preparing":
        return {
          icon: Package,
          bg: "bg-amber-50 dark:bg-amber-950/30",
          color: "text-amber-600 dark:text-amber-400",
          label: "Preparing",
        };
      case "donation":
        return {
          icon: Heart,
          bg: "bg-rose-50 dark:bg-rose-950/30",
          color: "text-rose-500 dark:text-rose-400",
          label: "Donation",
        };
      case "blocked":
        return {
          icon: XCircle,
          bg: "bg-red-50 dark:bg-red-950/30",
          color: "text-red-500 dark:text-red-400",
          label: "Blocked",
        };
      default:
        return {
          icon: Bell,
          bg: "bg-muted",
          color: "text-muted-foreground",
          label: "Update",
        };
    }
  };

  const handleClick = (n: any) => {
    if (n.type === "donation") {
      const mockDonationData = {
        id: n.id,
        crop: n.message.split(" ")[3] || "Crops",
        kg: n.message.split(" ")[2] || "0",
        org: n.message.includes("to ")
          ? n.message.split("to ")[1].split(".")[0]
          : "Community Org",
        method: n.message.includes("Tracking") ? "pickup" : "dropoff",
        tracking: n.message.includes("Tracking Number: ")
          ? n.message.split("Tracking Number: ")[1].split(".")[0]
          : null,
        address: n.message.includes("location: ")
          ? n.message.split("location: ")[1].split(".")[0]
          : "12, Jalan Bangsar Utama, 59000 KL",
        timestamp: n.timestamp,
      };
      navigate(`/donation-details/${n.id}`, { state: mockDonationData });
      return;
    }

    if (n.type === "blocked") return;

    if (n.type === "new_order" && n.orderId) {
      navigate(`/new-order/${n.orderId}`);
    } else if (n.type === "order_cancelled_seller" && n.orderId) {
      navigate(`/refund/${n.orderId}`);
    } else if (n.type === "order_preparing" && n.orderId) {
      navigate(`/order-details/${n.orderId}?from=seller`);
    } else if (n.orderId) {
      navigate(`/order-details/${n.orderId}?from=notification`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border sticky top-0 z-10">
        <h1 className="text-lg font-bold text-foreground">
          {t("notifications")}
        </h1>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-border bg-card">
        <button
          onClick={() => setTab("buyer")}
          className={`flex-1 py-3.5 text-sm font-semibold text-center transition-colors relative ${
            tab === "buyer" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {t("my_notifications")}
          {tab === "buyer" && (
            <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
          )}
        </button>
        <button
          onClick={() => setTab("seller")}
          className={`flex-1 py-3.5 text-sm font-semibold text-center transition-colors relative ${
            tab === "seller" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {t("seller_updates")}
          {tab === "seller" && (
            <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
          )}
        </button>
      </div>

      <div className="px-4 py-4 space-y-2">
        {current.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
              <Bell className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {t("no_notifications")}
            </p>
          </div>
        )}

        {current.map((n) => {
          const cfg = getIconConfig(n.type);
          const IconComponent = cfg.icon;
          return (
            <button
              key={n.id}
              onClick={() => handleClick(n)}
              className="w-full bg-card rounded-xl border border-border text-left active:scale-[0.99] transition-transform shadow-sm overflow-hidden"
            >
              <div className="p-4 flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}
                >
                  <IconComponent className={`w-5 h-5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-sm text-foreground leading-tight">
                          {n.title}
                        </h3>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(n.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
