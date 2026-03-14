import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Minus, Plus, MessageCircle, MapPin, Store } from "lucide-react";
import { useApp, generateTrackingNumber } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import FreshnessIndicator from "@/components/FreshnessIndicator";
import { toast } from "sonner";

const sourceTypeIcons: Record<string, string> = {
  Restaurant: "🍽️",
  Farm: "🌾",
  Supermarket: "🏪",
  "Community Donor": "🤝",
};

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, setListings, currentUser, walletBalance, setWalletBalance, orders, setOrders, notifications, setNotifications, transactions, setTransactions, chatThreads, setChatThreads } = useApp();
  const listing = listings.find((l) => l.id === id);
  const [qty, setQty] = useState(1);
  const [showChatBox, setShowChatBox] = useState(false);

  if (!listing) return <div className="p-4">Item not found</div>;

  const total = listing.price * qty;

  const handleQtyChange = (value: string) => {
    const parsed = parseInt(value);
    if (isNaN(parsed) || parsed < 1) {
      setQty(1);
    } else {
      setQty(Math.min(listing.stock, parsed));
    }
  };

  const handleMessageSeller = () => {
    if (listing.sellerId === currentUser.id) {
      toast.info("This is your own listing");
      return;
    }
    // Navigate directly to the chat thread for this seller
    const existing = chatThreads.find((t) => t.participantId === listing.sellerId);
    if (existing) {
      navigate(`/chat/${existing.id}`);
    } else {
      const newThread = {
        id: `c${Date.now()}`,
        participantId: listing.sellerId,
        participantName: listing.seller,
        participantAvatar: "👨‍🌾",
        messages: [],
      };
      setChatThreads([newThread, ...chatThreads]);
      navigate(`/chat/${newThread.id}`);
    }
  };

  const handleSendChat = () => {
    if (listing.sellerId === currentUser.id) return;
    const msgText = chatMessage.trim() || `Hi, I'm interested in your ${listing.name}!`;
    const existing = chatThreads.find((t) => t.participantId === listing.sellerId);
    if (existing) {
      const newMsg = { id: `m${Date.now()}`, senderId: currentUser.id, text: msgText, timestamp: new Date() };
      setChatThreads(chatThreads.map((t) =>
        t.id === existing.id ? { ...t, messages: [...t.messages, newMsg] } : t
      ));
      navigate(`/chat/${existing.id}`);
    } else {
      const newThread = {
        id: `c${Date.now()}`,
        participantId: listing.sellerId,
        participantName: listing.seller,
        participantAvatar: "👨‍🌾",
        messages: [
          { id: `m${Date.now()}`, senderId: currentUser.id, text: msgText, timestamp: new Date() },
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
    const trackingNumber = generateTrackingNumber();
    const newOrder = {
      id: `o${Date.now()}`,
      listing,
      quantity: qty,
      totalPrice: total,
      status: "pending" as const,
      buyerId: currentUser.id,
      sellerId: listing.sellerId,
      trackingNumber,
      createdAt: new Date(),
      address: currentUser.address || "123 Farm Road, KL",
      buyerName: currentUser.username,
      buyerPhone: currentUser.phone,
    };
    setOrders([newOrder, ...orders]);
    setTransactions([
      { id: `t${Date.now()}`, type: "purchase" as const, amount: -total, description: `Purchase: ${listing.name}`, timestamp: new Date() },
      ...transactions,
    ]);
    // Fix 4: Reduce listing stock after purchase
    setListings(listings.map((l) =>
      l.id === listing.id ? { ...l, stock: Math.max(0, l.stock - qty) } : l
    ));
    // Fix 5: Short notification message - "click to see details"
    // Fix 7: Only add buyer notification, no seller update notification
    setNotifications([
      {
        id: `n${Date.now()}`, type: "order_confirmed", title: "Order Placed",
        message: `Your order for ${listing.name} x${qty}kg has been placed. Click to see details.`,
        orderId: newOrder.id, timestamp: new Date(), read: false,
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

            {listing.freshness && (
              <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs font-semibold text-foreground mb-1">Food Freshness Level</p>
                <FreshnessIndicator level={listing.freshness} />
                {listing.bestBefore && (
                  <p className="text-xs text-muted-foreground mt-1">Best before: <span className="font-medium text-foreground">{listing.bestBefore}</span></p>
                )}
              </div>
            )}

            {listing.source && (
              <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                  <Store className="w-3.5 h-3.5" /> Food Source
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span>{sourceTypeIcons[listing.source.type] || "📦"}</span>
                    <span className="text-foreground font-medium">{listing.source.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{listing.source.location}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Distance from you: <span className="font-medium text-foreground">{listing.source.distance} km</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Source Type: <span className="font-medium text-foreground">{listing.source.type}</span>
                  </p>
                </div>
                {listing.freshness && listing.freshness >= 4 && (
                  <p className="text-[10px] text-primary mt-2 font-medium">
                    If ordered before 2:00 PM, courier will pick up today.
                  </p>
                )}
              </div>
            )}

            {listing.sellerId !== currentUser.id && (
              <div className="flex gap-2 mt-3">
                {!showChatBox ? (
                  <button onClick={handleMessageSeller}
                    className="py-2 px-4 rounded-lg border border-primary text-primary text-sm font-medium flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Chat With Seller
                  </button>
                ) : (
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder={`Hi, I'm interested in your ${listing.name}!`}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                    <div className="flex gap-2">
                      <button onClick={handleSendChat}
                        className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" /> Send Message
                      </button>
                      <button onClick={() => setShowChatBox(false)}
                        className="py-2 px-3 rounded-lg border border-border text-foreground text-sm font-medium">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">Quantity (kg)</label>
          <div className="flex items-center gap-4">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <Minus className="w-4 h-4 text-primary" />
            </button>
            <input
              type="number"
              value={qty}
              onChange={(e) => handleQtyChange(e.target.value)}
              className="w-16 text-center text-lg font-semibold bg-background border border-border rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min={1}
              max={listing.stock}
            />
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
