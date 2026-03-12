import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, CheckCircle, XCircle, ShoppingBag, Truck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
  const { notifications } = useApp();
  const [tab, setTab] = useState<"buyer" | "seller">("buyer");
  const navigate = useNavigate();

  const buyerNotifs = notifications.filter((n) =>
    ["order_shipped", "order_confirmed", "order_cancelled"].includes(n.type)
  );
  const sellerNotifs = notifications.filter((n) =>
    ["new_order", "order_cancelled_seller", "order_preparing"].includes(n.type)
  );

  const current = tab === "buyer" ? buyerNotifs : sellerNotifs;

  const getIcon = (type: string) => {
    switch (type) {
      case "order_shipped": return <Package className="w-5 h-5 text-info" />;
      case "order_confirmed": return <CheckCircle className="w-5 h-5 text-success" />;
      case "order_cancelled":
      case "order_cancelled_seller": return <XCircle className="w-5 h-5 text-destructive" />;
      case "new_order": return <ShoppingBag className="w-5 h-5 text-primary" />;
      case "order_preparing": return <Truck className="w-5 h-5 text-primary" />;
      default: return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const handleClick = (n: typeof notifications[0]) => {
    if (n.type === "new_order") navigate(`/new-order/${n.orderId}`);
    else if (n.type === "order_cancelled" || n.type === "order_cancelled_seller") navigate(`/refund/${n.orderId}`);
    else if (n.type === "order_preparing") navigate(`/order-details/${n.orderId}?from=seller`);
    else navigate(`/order-details/${n.orderId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Notifications" />

      <div className="flex border-b border-border">
        <button
          onClick={() => setTab("buyer")}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
            tab === "buyer" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
          }`}
        >
          My Notifications
        </button>
        <button
          onClick={() => setTab("seller")}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
            tab === "seller" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
          }`}
        >
          Seller Updates
        </button>
      </div>

      <div className="px-4 py-3 space-y-2">
        {current.length === 0 && (
          <p className="text-center text-muted-foreground py-10 text-sm">No notifications</p>
        )}
        {current.map((n) => (
          <button
            key={n.id}
            onClick={() => handleClick(n)}
            className="w-full bg-card rounded-xl p-3 flex items-start gap-3 border border-border text-left"
          >
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center shrink-0">
              {getIcon(n.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-foreground">{n.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(n.timestamp, { addSuffix: true })}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
