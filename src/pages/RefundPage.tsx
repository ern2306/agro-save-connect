import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";

const banks = [
  "Maybank",
  "CIMB Bank",
  "Public Bank",
  "RHB Bank",
  "Hong Leong Bank",
  "AmBank",
];

const RefundPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    orders,
    setOrders,
    walletBalance,
    setWalletBalance,
    transactions,
    setTransactions,
    currentUser,
  } = useApp();
  const order = orders.find((o) => o.id === id);
  const [selectedBank, setSelectedBank] = useState("");

  if (!order) return <div className="p-4">Order not found</div>;

  const isRefundLocked = order.refundStatus === "processed";
  const cancelledBySeller = order.cancelledBy === "seller";
  const cancelledByBuyer = order.cancelledBy === "buyer";

  const handleRefund = () => {
    if (isRefundLocked) return;
    if (!selectedBank) {
      toast.error("Please select a bank");
      return;
    }

    // Logic: If the current user is the seller, they are paying back the buyer.
    // The money should be deducted from the seller's wallet.
    const isSeller = currentUser.id === order.sellerId;

    if (isSeller) {
      if (walletBalance < order.totalPrice) {
        toast.error("Insufficient balance to process refund.");
        return;
      }

      // Deduct from seller
      setWalletBalance(walletBalance - order.totalPrice);
      setTransactions([
        {
          id: `t${Date.now()}`,
          type: "transfer",
          amount: -order.totalPrice,
          description: `Refund issued to buyer: ${order.listing.name}`,
          timestamp: new Date(),
        },
        ...transactions,
      ]);
    } else {
      // If the current user is the buyer, they are receiving the refund.
      setWalletBalance(walletBalance + order.totalPrice);
      setTransactions([
        {
          id: `t${Date.now()}`,
          type: "refund",
          amount: order.totalPrice,
          description: `Refund received: ${order.listing.name}`,
          timestamp: new Date(),
        },
        ...transactions,
      ]);
    }

    setOrders(
      orders.map((o) =>
        o.id === id ? { ...o, refundStatus: "processed" as const } : o
      )
    );

    toast.success(
      isSeller ? "Refund issued successfully." : "Refund received successfully."
    );
    navigate("/notifications");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Refund Management" showBack />
      <div className="px-4 py-4 space-y-4">
        {/* Status banners */}
        {cancelledByBuyer && (
          <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20">
            <p className="text-sm font-semibold text-destructive">
              Order Cancelled by Buyer
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              A refund has been requested for this order.
            </p>
          </div>
        )}
        {cancelledBySeller && (
          <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20">
            <p className="text-sm font-semibold text-destructive">
              Order Cancelled by Seller
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              The order was cancelled by the seller. Refund must be processed.
            </p>
          </div>
        )}
        {order.refundStatus === "processed" && (
          <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
            <p className="text-sm font-semibold text-emerald-600">
              ✅ Refund Processed
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              The refund transaction has been completed.
            </p>
          </div>
        )}

        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="font-medium text-foreground mb-2">Order Summary</h3>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Item:</span>
            <span className="text-foreground font-medium">
              {order.listing.name} x{order.quantity}kg
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="text-primary font-bold">
              RM {order.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {!isRefundLocked && (
          <>
            <div className="bg-card rounded-xl p-4 border border-border">
              <h3 className="font-medium text-foreground mb-2">
                Refund Method
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Bank Transfer
              </p>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Select Bank
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Choose bank...</option>
                {banks.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRefund}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
            >
              {currentUser.id === order.sellerId
                ? "Issue Refund to Buyer"
                : "Confirm Refund Receipt"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RefundPage;
