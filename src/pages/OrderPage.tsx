import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
  Image as ImageIcon,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import FreshnessIndicator from "@/components/FreshnessIndicator";

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    listings,
    currentUser,
    walletBalance,
    setWalletBalance,
    transactions,
    setTransactions,
    chatThreads,
    setChatThreads,
  } = useApp();
  const listing = (listings || []).find((l) => l.id === id);

  const [qty, setQty] = useState(1);
  const [showChatBox, setShowChatBox] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  if (!listing) return <div className="p-4 text-center">Product not found</div>;

  const total = (listing.price || 0) * qty;

  const handleSendChat = () => {
    if (!chatMessage.trim() && !selectedImage) {
      toast.error("Please enter a message or select an image");
      return;
    }

    const newMessage = {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      text:
        chatMessage || (selectedImage ? `[Image: ${selectedImage.name}]` : ""),
      timestamp: new Date(),
    };

    const existingThread = chatThreads.find(
      (t) => t.participantId === listing.sellerId
    );
    if (existingThread) {
      setChatThreads(
        chatThreads.map((t) =>
          t.id === existingThread.id
            ? { ...t, messages: [...t.messages, newMessage] }
            : t
        )
      );
    } else {
      setChatThreads([
        ...chatThreads,
        {
          id: `c${Date.now()}`,
          participantId: listing.sellerId,
          participantName: listing.seller,
          participantAvatar: "👨‍🌾",
          messages: [newMessage],
        },
      ]);
    }

    toast.success("Message sent!");
    setChatMessage("");
    setSelectedImage(null);
    setShowChatBox(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-background rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground flex-1">
          Product Details
        </h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="aspect-square bg-primary-light rounded-xl flex items-center justify-center p-6 border border-border">
          <img
            src={listing.image}
            alt={listing.name}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {listing.name}
          </h2>
          <p className="text-primary text-lg font-bold mb-3">
            RM {listing.price?.toFixed(2)}/kg
          </p>
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Stock Available
              </span>
              <span className="font-medium text-foreground">
                {listing.stock} kg
              </span>
            </div>
            {listing.freshness && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Freshness</span>
                <FreshnessIndicator level={listing.freshness} />
              </div>
            )}
          </div>
        </div>

        {listing.sellerId !== currentUser.id && (
          <div className="mt-3">
            {!showChatBox ? (
              <button
                onClick={() => setShowChatBox(true)}
                className="py-2 px-4 rounded-lg border border-primary text-primary text-sm font-medium flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Chat With Seller
              </button>
            ) : (
              <div className="bg-card rounded-xl p-4 border border-border space-y-3">
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={`Hi, I'm interested in your ${listing.name}!`}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium cursor-pointer hover:bg-primary/20 transition-colors">
                    <ImageIcon className="w-3.5 h-3.5" />
                    {selectedImage ? selectedImage.name : "Attach Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setSelectedImage(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSendChat}
                    className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                  >
                    Send Message
                  </button>
                  <button
                    onClick={() => setShowChatBox(false)}
                    className="py-2 px-4 rounded-lg border border-border text-foreground text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
