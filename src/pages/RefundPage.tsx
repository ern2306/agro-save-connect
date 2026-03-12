import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";

const banks = ["Maybank", "CIMB Bank", "Public Bank", "RHB Bank", "Hong Leong Bank", "AmBank"];

const RefundPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, setOrders, walletBalance, setWalletBalance, transactions, setTransactions } = useApp();
  const order = orders.find((o) => o.id === id);
  const [selectedBank, setSelectedBank] = useState("");

  if (!order) return <div className="p-4">Order not found</div>;

  const isRefundLocked = order.refundStatus === "processed" || order.refundStatus === "requested";
  const cancelledBySeller = order.cancelledBy === "seller";
  const cancelledByBuyer = order.cancelledBy === "buyer";

  const handleRefund = () => {
    if (isRefundLocked) return;
    if (!selectedBank) {
      toast.error("Please select a bank");
      return;
    }
    if (walletBalance < order.totalPrice) {
      toast.error("Insufficient wallet balance for refund");
      return;
    }
    setWalletBalance((b) => b - order.totalPrice);
    setTransactions([
      { id: `t${Date.now()}`, type: "refund" as const, amount: -order.totalPrice, description: `Refund: ${order.listing.name}`, timestamp: new Date() },
      ...transactions,
    ]);
    setOrders(orders.map((o) =>
      o.id === id ? { ...o, refundStatus: "processed" as const } : o
    ));
    toast.success("Refund confirmed!");
    navigate("/notifications");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Refund" showBack />
      <div className="px-4 py-4 space-y-4">
        {/* Status banners */}
        {cancelledByBuyer && (
          <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20">
            <p className="text-sm font-semibold text-destructive">Order Cancelled – Refund Requested by User</p>
            <p className="text-xs text-muted-foreground mt-1">Refund is being processed. No further action needed.</p>
          </div>
        )}
        {cancelledBySeller && (
          <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20">
            <p className="text-sm font-semibold text-destructive">Order Cancelled by Seller – Refund in Process</p>
            <p className="text-xs text-muted-foreground mt-1">The seller has cancelled this order. Refund will be processed automatically.</p>
          </div>
        )}
        {order.refundStatus === "processed" && (
          <div className="bg-accent/30 rounded-xl p-4">
            <p className="text-sm font-semibold text-foreground">✅ Refund Processed</p>
            <p className="text-xs text-muted-foreground mt-1">The refund has been completed.</p>
          </div>
        )}

        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="font-medium text-foreground mb-2">Refund Details</h3>
          <p className="text-sm text-muted-foreground">Item: {order.listing.name} x{order.quantity}kg</p>
          <p className="text-primary font-bold text-lg mt-1">Refund Amount: RM {order.totalPrice.toFixed(2)}</p>
        </div>

        {!isRefundLocked && (
          <>
            <div className="bg-card rounded-xl p-4 border border-border">
              <h3 className="font-medium text-foreground mb-2">Refund Method</h3>
              <p className="text-sm text-muted-foreground mb-3">Online Banking</p>
              <label className="text-sm font-medium text-foreground mb-1 block">Select Bank</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Choose bank...</option>
                {banks.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <button onClick={handleRefund} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
              Confirm Refund to Buyer
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RefundPage;
