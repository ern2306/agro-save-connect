import { useParams, useNavigate } from "react-router-dom";
import { Package, MapPin, Truck, CheckCircle, Clock, XCircle, ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { format } from "date-fns";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useApp();
  const order = orders.find((o) => o.id === id);

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
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-0.5" />
            <p className="text-sm text-muted-foreground">{order.address}</p>
          </div>
          {order.trackingNumber && (
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-primary mt-0.5" />
              <p className="text-sm text-muted-foreground">Tracking: {order.trackingNumber}</p>
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="font-medium text-foreground text-sm mb-4">Order Timeline</h3>
          {isCancelled ? (
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-destructive" />
              <span className="text-destructive font-medium text-sm">Order Cancelled</span>
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

        <button onClick={() => navigate("/explore")}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
