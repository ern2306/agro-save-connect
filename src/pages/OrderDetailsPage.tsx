import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Package, MapPin, Truck, CheckCircle, Clock, XCircle, ArrowLeft, Copy, Printer, User } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { format } from "date-fns";
import { toast } from "sonner";

const DEFAULT_NAME = "John Farmer";
const DEFAULT_ADDRESS = "123 Farm aroad, Kuala Lumpur";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { orders, setOrders, notifications, setNotifications, walletBalance, setWalletBalance, transactions, setTransactions } = useApp();
  const order = orders.find((o) => o.id === id);
  const fromSeller = searchParams.get("from") === "seller";
  const fromNotification = searchParams.get("from") === "notification";

  if (!order) return <div className="p-4">Order not found</div>;

  const statusSteps = [
    { key: "pending", label: "Order Placed", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "preparing", label: "Preparing", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const statusIndex = statusSteps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "cancelled";

  const handleBuyerCancel = () => {
    // Fix 6: ADD back refund to buyer wallet (not deduct)
    setWalletBalance((b) => b + order.totalPrice);
    setTransactions([
      { id: `t${Date.now()}`, type: "refund" as const, amount: order.totalPrice, description: `Refund: ${order.listing.name}`, timestamp: new Date() },
      ...transactions,
    ]);
    setOrders(orders.map((o) =>
      o.id === id ? { ...o, status: "cancelled" as const, cancelledBy: "buyer" as const, refundStatus: "requested" as const } : o
    ));
    setNotifications([
      {
        id: `n${Date.now()}`, type: "order_cancelled_seller" as const, title: "Order Cancelled by Buyer",
        message: `The buyer has cancelled the order for ${order.listing.name}. Refund has been completed by system.`,
        orderId: id!, timestamp: new Date(), read: false,
      },
      ...notifications,
    ]);
    toast.info("Order cancelled. Refund processed.");
    navigate("/notifications");
  };

  // Fix 8: When viewing from notification, use default buyer info
  const displayName = fromNotification ? DEFAULT_NAME : (order.buyerName || DEFAULT_NAME);
  const displayAddress = fromNotification ? DEFAULT_ADDRESS : (order.address || DEFAULT_ADDRESS);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Order Details" showBack />
      <div className="px-4 py-4 space-y-4">
        <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-primary-light flex items-center justify-center overflow-hidden">
            <img src={order.listing.image} alt={order.listing.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">{order.listing.name} x{order.quantity}kg</h3>
            <p className="text-primary font-bold">RM {order.totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border space-y-2">
          <h3 className="font-medium text-foreground text-sm">Delivery Information</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4 text-primary" />
            <span>{displayName}</span>
          </div>
          {order.listing.source && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{order.listing.source.location}</span>
            </div>
          )}
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary mt-0.5" />
            <span>Delivery to: {displayAddress}</span>
          </div>
          {order.trackingNumber && (
            <div className="pt-2 border-t border-border">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-sm font-medium text-foreground">Tracking: {order.trackingNumber}</span>
              </div>
              {fromSeller && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { navigator.clipboard.writeText(order.trackingNumber!); toast.success("Copied!"); }}
                    className="py-1.5 px-3 rounded-lg border border-border text-foreground text-xs font-medium flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                  <button onClick={() => navigate(`/print-label/${order.trackingNumber}`)}
                    className="py-1.5 px-3 rounded-lg border border-border text-foreground text-xs font-medium flex items-center gap-1">
                    <Printer className="w-3 h-3" /> Print Label
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="font-medium text-foreground text-sm mb-4">Order Timeline</h3>
          {isCancelled ? (
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-destructive" />
              <span className="text-destructive font-medium text-sm">
                Order Cancelled{order.cancelledBy ? ` by ${order.cancelledBy}` : ""}
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              {statusSteps.map((step, i) => {
                const done = i <= statusIndex;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? "bg-primary" : "bg-muted"}`}>
                      <Icon className={`w-4 h-4 ${done ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    </div>
                    <span className={`text-sm ${done ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step.label}</span>
                    {i === statusIndex && (
                      <span className="text-xs text-primary ml-auto">{format(order.createdAt, "dd MMM, HH:mm")}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cancel button: only show when NOT from notification and NOT from seller view */}
        {!isCancelled && !fromSeller && !fromNotification && order.status !== "delivered" && (
          <button onClick={handleBuyerCancel}
            className="w-full py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm">
            Cancel Order
          </button>
        )}

        <button onClick={() => navigate("/explore")}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;