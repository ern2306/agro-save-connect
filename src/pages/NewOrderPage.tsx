import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";

const NewOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, setOrders, notifications, setNotifications } = useApp();
  const order = orders.find((o) => o.id === id);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [showTracking, setShowTracking] = useState(false);

  if (!order) return <div className="p-4">Order not found</div>;

  const handlePrepare = () => setShowTracking(true);

  const handleShip = () => {
    if (!trackingNumber.trim()) {
      toast.error("Please enter tracking number");
      return;
    }
    setOrders(orders.map((o) =>
      o.id === id ? { ...o, status: "shipped" as const, trackingNumber } : o
    ));
    setNotifications([
      {
        id: `n${Date.now()}`, type: "order_shipped", title: "Order Shipped",
        message: `Order for ${order.listing.name} has been shipped`, orderId: id!,
        timestamp: new Date(), read: false,
      },
      ...notifications,
    ]);
    toast.success("Order shipped!");
    navigate("/notifications");
  };

  const handleCancel = () => {
    setOrders(orders.map((o) =>
      o.id === id ? { ...o, status: "cancelled" as const } : o
    ));
    setNotifications([
      {
        id: `n${Date.now()}`, type: "order_cancelled", title: "Order Cancelled",
        message: `Order for ${order.listing.name} has been cancelled`, orderId: id!,
        timestamp: new Date(), read: false,
      },
      ...notifications,
    ]);
    toast.info("Order cancelled");
    navigate("/notifications");
  };

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
          <p className="text-sm text-muted-foreground">Buyer address: {order.address}</p>
        </div>

        {showTracking ? (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Tracking Number</label>
              <input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button onClick={handleShip} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
              Confirm & Ship
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button onClick={handlePrepare} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
              Preparing Order
            </button>
            <button onClick={handleCancel} className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm">
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewOrderPage;
