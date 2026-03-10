import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Minus, Plus, MessageCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, currentUser, walletBalance, setWalletBalance, orders, setOrders, notifications, setNotifications, transactions, setTransactions, chatThreads, setChatThreads } = useApp();
  const listing = listings.find((l) => l.id === id);
  const [qty, setQty] = useState(1);

  if (!listing) return <div className="p-4">Item not found</div>;

  const total = listing.price * qty;

  const handleMessageSeller = () => {
    if (listing.sellerId === currentUser.id) {
      toast.info("This is your own listing");
      return;
    }
    const existing = chatThreads.find((t) => t.participantId === listing.sellerId);
    if (existing) {
      navigate(`/chat/${existing.id}`);
    } else {
      const newThread = {
        id: `c${Date.now()}`,
        participantId: listing.sellerId,
        participantName: listing.seller,
        participantAvatar: "👨‍🌾",
        messages: [
          { id: `m${Date.now()}`, senderId: currentUser.id, text: `Hi, I'm interested in your ${listing.name}!`, timestamp: new Date() },
        ],
      };
      setChatThreads([newThread, ...chatThreads]);
      navigate(`/chat/${newThread.id}`);
    }
  };

  const handlePurchase = () => {
    if (walletBalance < total) {
      toast.error("Insufficient wallet balance");
      return;
    }
    setWalletBalance((b) => b - total);
    const newOrder = {
      id: `o${Date.now()}`,
      listing,
      quantity: qty,
      totalPrice: total,
      status: "pending" as const,
      buyerId: currentUser.id,
      sellerId: listing.sellerId,
      createdAt: new Date(),
      address: currentUser.address || "123 Farm Road, KL",
    };
    setOrders([newOrder, ...orders]);
    setTransactions([
      { id: `t${Date.now()}`, type: "purchase" as const, amount: -total, description: `Purchase: ${listing.name}`, timestamp: new Date() },
      ...transactions,
    ]);
    // Buyer notification goes to "My Notifications" (order_confirmed type)
    setNotifications([
      {
        id: `n${Date.now()}`, type: "order_confirmed", title: "Order Placed",
        message: `Your order for ${listing.name} x${qty}kg has been placed`, orderId: newOrder.id,
        timestamp: new Date(), read: false,
      },
      // Seller notification goes to "Seller Updates" (new_order type)
      {
        id: `n${Date.now() + 1}`, type: "new_order", title: "New Order",
        message: `New order received: ${listing.name} x${qty}kg`, orderId: newOrder.id,
        timestamp: new Date(), read: false,
      },
      ...notifications,
    ]);
    toast.success("Order placed!");
    navigate(`/order-details/${newOrder.id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Order" showBack />
      <div className="px-4 py-4">
        <div className="bg-card rounded-xl overflow-hidden border border-border mb-4">
          <div className="h-56 bg-primary-light flex items-center justify-center p-6">
            <img src={listing.image} alt={listing.name} className="h-full object-contain" />
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-foreground">{listing.name}</h2>
            <p className="text-primary font-bold text-lg">RM {listing.price.toFixed(2)}/kg</p>
            <p className="text-sm text-muted-foreground">{listing.stock} kg available</p>
            <p className="text-sm text-muted-foreground">Seller: {listing.seller}</p>
            {listing.sellerId !== currentUser.id && (
              <button onClick={handleMessageSeller}
                className="mt-3 py-2 px-4 rounded-lg border border-primary text-primary text-sm font-medium flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Message Seller
              </button>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">Quantity (kg)</label>
          <div className="flex items-center gap-4">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <Minus className="w-4 h-4 text-primary" />
            </button>
            <span className="text-lg font-semibold w-12 text-center">{qty}</span>
            <button onClick={() => setQty(Math.min(listing.stock, qty + 1))} className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <Plus className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">RM {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-muted-foreground">Wallet Balance</span>
            <span className="font-medium text-foreground">RM {walletBalance.toFixed(2)}</span>
          </div>
        </div>

        <button onClick={handlePurchase} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Pay RM {total.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
