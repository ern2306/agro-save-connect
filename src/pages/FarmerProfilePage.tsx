import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, MapPin, Star, Shield, ShoppingCart } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const FarmerProfilePage = () => {
  const { farmerId } = useParams();
  const navigate = useNavigate();
  const { listings, chatThreads, setChatThreads, currentUser } = useApp();

  // Mock farmer data - in real app, this would come from a database
  const farmerData: Record<string, any> = {
    "farmer1": {
      id: "farmer1",
      name: "Farmer Ali",
      avatar: "👨‍🌾",
      rating: 4.9,
      interactions: 240,
      location: "SEMENYIH, SELANGOR",
      verified: true,
      totalSales: 1240,
      joinedDate: "Jan 2024",
      reports: 0,
      status: "online",
    },
    "farmer2": {
      id: "farmer2",
      name: "Farmer Sarah",
      avatar: "👩‍🌾",
      rating: 4.7,
      interactions: 180,
      location: "KUALA LUMPUR",
      verified: true,
      totalSales: 890,
      joinedDate: "Mar 2024",
      reports: 0,
      status: "online",
    },
  };

  const farmer = farmerData[farmerId || "farmer1"] || farmerData["farmer1"];
  const farmerListings = listings.filter((l) => l.sellerId === farmer.id);

  const handleChatWithFarmer = () => {
    const existingThread = chatThreads.find((t) => t.participantId === farmer.id);
    if (existingThread) {
      navigate(`/chat/${existingThread.id}`);
    } else {
      const newThread = {
        id: `c${Date.now()}`,
        participantId: farmer.id,
        participantName: farmer.name,
        participantAvatar: farmer.avatar,
        messages: [],
      };
      setChatThreads([newThread, ...chatThreads]);
      navigate(`/chat/${newThread.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-background rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground flex-1">Farmer Profile</h1>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-b from-primary/20 to-background px-4 py-8 text-center">
        <div className="w-24 h-24 rounded-full bg-white border-4 border-primary flex items-center justify-center text-5xl mx-auto mb-4 shadow-lg">
          {farmer.avatar}
        </div>
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          {farmer.name}
          {farmer.verified && <Shield className="w-5 h-5 text-primary" />}
        </h2>
        <div className="flex items-center justify-center gap-4 mt-2 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold">{farmer.rating}</span>
            <span className="text-muted-foreground">({farmer.interactions} INTERACTIONS)</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 mt-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{farmer.location}</span>
        </div>
      </div>

      {/* Chat Button */}
      <div className="px-4 py-4">
        <button
          onClick={handleChatWithFarmer}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Chat with Farmer
        </button>
      </div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <ShoppingCart className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{farmer.totalSales}+</p>
          <p className="text-xs text-muted-foreground">TOTAL SALES</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <div className="text-xl font-bold text-primary mx-auto mb-2">📅</div>
          <p className="text-lg font-bold text-foreground">{farmer.joinedDate}</p>
          <p className="text-xs text-muted-foreground">JOINED</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <div className="text-xl font-bold text-destructive mx-auto mb-2">⚠️</div>
          <p className="text-lg font-bold text-foreground">{farmer.reports}</p>
          <p className="text-xs text-muted-foreground">REPORTS</p>
        </div>
      </div>

      {/* Active Listings */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Active Listings</h3>
          <span className="text-sm text-primary font-semibold">{farmerListings.length} ITEMS</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {farmerListings.map((listing) => (
            <button
              key={listing.id}
              onClick={() => navigate(`/order/${listing.id}`)}
              className="bg-card rounded-xl overflow-hidden border border-border text-left transition-transform active:scale-[0.98]"
            >
              <div className="aspect-square bg-primary-light flex items-center justify-center p-3">
                <img src={listing.image} alt={listing.name} className="w-full h-full object-contain" />
                <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  RM {listing.price.toFixed(2)}
                </span>
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-foreground text-sm">{listing.name}</h4>
                <p className="text-xs text-muted-foreground">{listing.stock}KG LEFT</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">View Details</span>
                  <span className="text-primary">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {farmerListings.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No active listings</p>
        )}
      </div>
    </div>
  );
};

export default FarmerProfilePage;
