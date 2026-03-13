import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Copy, Printer, Phone, MapPin, User } from "lucide-react";
import { useApp, generateTrackingNumber } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";

const NewOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, setOrders, notifications, setNotifications, currentUser, walletBalance, setWalletBalance, transactions, setTransactions } = useApp();
  const order = orders.find((o) => o.id === id);
  const [prepared, setPrepared] = useState(false);
  const [generatedTracking, setGeneratedTracking] = useState("");

  if (!order) return <div className="p-4">Order not found</div>;

  const handlePrepare = () => {
    const tracking = generateTrackingNumber();
    setGeneratedTracking(tracking);
    setOrders(orders.map((o) =>
      o.id === id ? { ...o, status: "preparing" as const, trackingNumber: tracking } : o
    ));
    setNotifications([
      {
        id: `n${Date.now()}`, type: "order_preparing" as const, title: "Order Preparing",
        message: `Order for ${order.listing.name} is being prepared. Tracking: ${tracking}. Courier will come pick up within 2 days.`,
        orderId: id!, timestamp: new Date(), read: false,
      },
      ...notifications,
    ]);
    toast.success("Order is being prepared!");
    setPrepared(true);
  };

  const handleCancel = () => {
    // Deduct refund from seller wallet
    setWalletBalance((b) => b - order.totalPrice);
    setTransactions([
      { id: `t${Date.now()}`, type: "refund" as const, amount: -order.totalPrice, description: `Refund: ${order.listing.name}`, timestamp: new Date() },
      ...transactions,
    ]);
    setOrders(orders.map((o) =>
      o.id === id ? { ...o, status: "cancelled" as const, cancelledBy: "seller" as const, refundStatus: "processed" as const } : o
    ));
    setNotifications([
      {
        id: `n${Date.now()}`, type: "order_cancelled_seller" as const, title: "Order Cancelled",
        message: `Order for ${order.listing.name} has been cancelled. Refund has been completed by system.`,
        orderId: id!, timestamp: new Date(), read: false,
      },
      ...notifications,
    ]);
    toast.info("Order cancelled. Refund processed.");
    navigate("/notifications");
  };

  const handleCopyTracking = () => {
    const trk = generatedTracking || order.trackingNumber || "";
    navigator.clipboard.writeText(trk);
    toast.success("Tracking number copied!");
  };

  const trackingNum = generatedTracking || order.trackingNumber;
  const showPickup = prepared || order.status === "preparing";

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="New Order" showBack />
      <div className="px-4 py-4 space-y-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-lg bg-primary-light flex items-center justify-center overflow-hidden">
              <img src={order.listing.image} alt={order.listing.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{order.listing.name} x{order.quantity}kg</h3>
              <p className="text-primary font-bold">RM {order.totalPrice.toFixed(2)}</p>
            </div>
          </div>
          <div className="space-y-2 border-t border-border pt-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-3.5 h-3.5 text-primary" />
              <span>Buyer: {order.buyerName || "Customer"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>{order.buyerPhone || "+60XXXXXXXX"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>{order.address}</span>
            </div>
          </div>
        </div>

        {!showPickup && order.status !== "cancelled" && (
          <div className="flex gap-3">
            <button onClick={handlePrepare} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
              Preparing Order
            </button>
            <button onClick={handleCancel} className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm">
              Cancel Order
            </button>
          </div>
        )}

        {showPickup && (
          <div className="space-y-4">
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-xs font-semibold text-foreground mb-2">Tracking Number</p>
              <p className="text-lg font-bold text-primary mb-3">{trackingNum}</p>
              <div className="flex gap-2">
                <button onClick={handleCopyTracking}
                  className="flex-1 py-2 rounded-lg border border-border text-foreground text-xs font-medium flex items-center justify-center gap-1.5">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
                <button onClick={() => navigate(`/print-label/${trackingNum}`)}
                  className="flex-1 py-2 rounded-lg border border-border text-foreground text-xs font-medium flex items-center justify-center gap-1.5">
                  <Printer className="w-3.5 h-3.5" /> Print Label
                </button>
              </div>
            </div>

            <div className="bg-accent/30 rounded-xl p-4">
              <p className="text-2xl mb-2 text-center">📦</p>
              <p className="text-sm font-semibold text-foreground text-center">Courier will come to pick up within 2 days</p>
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <p><span className="font-medium text-foreground">Name:</span> {currentUser.username}</p>
                <p><span className="font-medium text-foreground">Phone:</span> {currentUser.phone}</p>
                <p><span className="font-medium text-foreground">Address:</span> {currentUser.address}</p>
              </div>
            </div>

            <button onClick={() => navigate("/notifications")} className="w-full py-3 rounded-xl border border-border text-foreground font-medium text-sm">
              Back to Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewOrderPage;
