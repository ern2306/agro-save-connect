import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  CheckCircle,
  XCircle,
  ShoppingBag,
  Truck,
  Heart,
  MapPin,
  Barcode,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
  const { notifications, orders, currentUser, listings } = useApp();
  const [tab, setTab] = useState<"buyer" | "seller">("buyer");
  const navigate = useNavigate();

  const buyerNotifs = notifications.filter((n) =>
    [
      "order_shipped",
      "order_confirmed",
      "order_cancelled",
      "donation",
    ].includes(n.type)
  );

  const userListingIds = listings.map((l) => l.id);
  const sellerNotifs = notifications.filter((n) => {
    if (
      !["new_order", "order_cancelled_seller", "order_preparing"].includes(
        n.type
      )
    ) {
      return false;
    }
    const order = orders.find((o) => o.id === n.orderId);
    // Fix: Don't show "new_order" notifications if the current user is the buyer (they're buying from someone else)
    // Only show if: order exists, buyer is NOT the current user, AND the listing belongs to the current user
    return (
      order &&
      order.buyerId !== currentUser.id &&
      userListingIds.includes(order.listing.id)
    );
  });

  const current = tab === "buyer" ? buyerNotifs : sellerNotifs;

  const getIcon = (type: string) => {
    switch (type) {
      case "order_shipped":
        return <Package className="w-5 h-5 text-info" />;
      case "order_confirmed":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "order_cancelled":
      case "order_cancelled_seller":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "new_order":
        return <ShoppingBag className="w-5 h-5 text-primary" />;
      case "order_preparing":
        return <Truck className="w-5 h-5 text-primary" />;
      case "donation":
        return <Heart className="w-5 h-5 text-success" />;
      default:
        return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const handleClick = (n: (typeof notifications)[0]) => {
    if (n.type === "donation") {
      // Navigate to donation details page with donation data
      navigate(`/donation-details/${n.id}`, { state: n.donationData });
      return;
    }
    if (n.type === "new_order") navigate(`/new-order/${n.orderId}`);
    else if (n.type === "order_cancelled_seller")
      navigate(`/refund/${n.orderId}`);
    else if (n.type === "order_preparing")
      navigate(`/order-details/${n.orderId}?from=seller`);
    else navigate(`/order-details/${n.orderId}?from=notification`);
  };

  // Enhanced donation notification card
  const DonationNotificationCard = ({
    n,
  }: {
    n: (typeof notifications)[0];
  }) => {
    const data = n.donationData;
    if (!data) return null;

    return (
      <button
        onClick={() => handleClick(n)}
        className="w-full bg-gradient-to-br from-success/5 to-success/10 rounded-xl p-4 border border-success/30 text-left hover:border-success/60 transition-all hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground">{n.title}</h3>

            {/* Donation details grid */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                <p className="text-xs text-muted-foreground">Crop</p>
                <p className="font-semibold text-sm text-foreground">
                  {data.crop}
                </p>
              </div>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="font-semibold text-sm text-foreground">
                  {data.kg} kg
                </p>
              </div>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2 col-span-2">
                <p className="text-xs text-muted-foreground">Organization</p>
                <p className="font-semibold text-sm text-foreground truncate">
                  {data.org}
                </p>
              </div>
            </div>

            {/* Delivery method info */}
            <div className="mt-3 flex items-center gap-2">
              {data.method === "dropoff" ? (
                <>
                  <MapPin className="w-4 h-4 text-success" />
                  <span className="text-xs text-muted-foreground">
                    Drop-off
                  </span>
                </>
              ) : (
                <>
                  <Barcode className="w-4 h-4 text-success" />
                  <span className="text-xs text-muted-foreground font-mono">
                    {data.tracking}
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              {formatDistanceToNow(n.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
      </button>
    );
  };

  // Regular notification card
  const RegularNotificationCard = ({ n }: { n: (typeof notifications)[0] }) => {
    return (
      <button
        onClick={() => handleClick(n)}
        className="w-full bg-card rounded-xl p-3 flex items-start gap-3 border border-border text-left hover:border-primary/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center shrink-0">
          {getIcon(n.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground">{n.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-3">
            {n.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(n.timestamp, { addSuffix: true })}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Notifications" />

      <div className="flex border-b border-border">
        <button
          onClick={() => setTab("buyer")}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
            tab === "buyer"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
        >
          My Notifications
        </button>
        <button
          onClick={() => setTab("seller")}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
            tab === "seller"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
        >
          Seller Updates
        </button>
      </div>

      <div className="px-4 py-3 space-y-2">
        {current.length === 0 && (
          <p className="text-center text-muted-foreground py-10 text-sm">
            No notifications
          </p>
        )}
        {current.map((n) => (
          <div key={n.id}>
            {n.type === "donation" ? (
              <DonationNotificationCard n={n} />
            ) : (
              <RegularNotificationCard n={n} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
