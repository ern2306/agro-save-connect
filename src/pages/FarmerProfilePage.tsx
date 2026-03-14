import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  MessageSquare,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  Package,
  Calendar,
  UserX,
  X,
  AlertTriangle,
  CheckCircle2,
  Edit3,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const FarmerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    listings,
    createChatIfNotExist,
    blockedUserIds,
    setBlockedUserIds,
    currentUser,
  } = useApp();

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  // Check if viewing own profile
  const isOwnProfile = id === currentUser.id;

  // Mocking farmer data
  const farmerListings = listings.filter((l) => l.sellerId === id);
  const farmerName = isOwnProfile
    ? currentUser.username
    : farmerListings[0]?.seller || "Farmer Profile";
  const farmerAvatar = isOwnProfile ? currentUser.avatar : "👨‍🌾";

  const isBlocked = blockedUserIds.includes(id || "");
  // User requested report counts to be either 0 or 1
  const reportCount = isBlocked ? 1 : 0;
  const rating = isBlocked ? 4.5 : 4.9;

  const blockReasons = [
    "False Information / Fake Items",
    "Inappropriate Language",
    "Delivery Delay / No Response",
    "Poor Product Quality",
    "Other Reasons",
  ];

  const handleBlock = () => {
    if (!selectedReason || !id) {
      toast.error("Please select a reason for blocking");
      return;
    }

    setBlockedUserIds((prev) => [...prev, id]);
    setIsBlockModalOpen(false);
    toast.success(`${farmerName} has been blocked`, {
      description: `Reason: ${selectedReason}.`,
      icon: <UserX className="w-4 h-4 text-red-500" />,
    });
  };

  const handleChatClick = () => {
    if (isBlocked || !id || isOwnProfile) return;
    createChatIfNotExist(id, farmerName);
    navigate(`/chat/${id}`);
  };

  const stats = [
    {
      label: "Total Sales",
      value: isOwnProfile ? "850+" : "1,240+",
      icon: Package,
    },
    {
      label: "Joined",
      value: isOwnProfile ? "Mar 2024" : "Jan 2024",
      icon: Calendar,
    },
    { label: "Reports", value: reportCount, icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header / Cover */}
      <div className="relative h-48 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Block Button (Hide if own profile) */}
        {!isBlocked && !isOwnProfile && (
          <button
            onClick={() => setIsBlockModalOpen(true)}
            className="absolute top-12 right-6 w-10 h-10 rounded-full bg-red-500/20 backdrop-blur-md flex items-center justify-center text-white border border-red-500/30 z-10 hover:bg-red-500/40 transition-colors"
          >
            <UserX className="w-5 h-5" />
          </button>
        )}

        <div className="absolute -bottom-1 left-0 right-0 h-12 bg-background rounded-t-[3rem]" />
      </div>

      {/* Profile Info */}
      <div className="px-6 -mt-20 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-[2.5rem] bg-card border-4 border-background flex items-center justify-center text-5xl shadow-xl mb-4 relative">
            {farmerAvatar}
            {isBlocked && (
              <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center">
                <UserX className="w-10 h-10 text-white" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <h1
              className={`text-2xl font-black tracking-tight ${
                isBlocked
                  ? "text-muted-foreground line-through"
                  : "text-foreground"
              }`}
            >
              {farmerName} {isOwnProfile && "(You)"}
            </h1>
            {!isBlocked && (
              <ShieldCheck className="w-5 h-5 text-blue-500 fill-blue-500/10" />
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
            <div className="flex items-center gap-1">
              <Star
                className={`w-3.5 h-3.5 ${
                  rating > 4
                    ? "text-amber-500 fill-amber-500"
                    : "text-red-500 fill-red-500"
                }`}
              />
              <span className="text-foreground">{rating}</span>
              <span>
                ({isOwnProfile ? 150 : 240 + reportCount} interactions)
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>
                {isOwnProfile ? "Kuala Lumpur" : "Semenyih, Selangor"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full mb-8">
            {isOwnProfile ? (
              <button
                onClick={() => navigate("/profile")}
                className="w-full bg-muted text-foreground font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Edit3 className="w-5 h-5" /> Edit My Profile
              </button>
            ) : (
              <button
                disabled={isBlocked}
                onClick={handleChatClick}
                className={`w-full font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all ${
                  isBlocked
                    ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                    : "bg-primary text-primary-foreground shadow-primary/20"
                }`}
              >
                <MessageSquare className="w-5 h-5" />{" "}
                {isBlocked ? "Blocked" : "Chat with Farmer"}
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-2xl p-3 flex flex-col items-center text-center gap-1.5 shadow-sm"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  stat.label === "Reports"
                    ? "bg-red-500/10 text-red-500"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-black text-foreground">
                  {stat.value}
                </p>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Active Listings */}
        {!isBlocked && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                {isOwnProfile ? "My Active Listings" : "Active Listings"}
              </h2>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                {farmerListings.length} Items
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {farmerListings.map((listing) => (
                <button
                  key={listing.id}
                  onClick={() => navigate(`/order/${listing.id}`)}
                  className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm group text-left active:scale-[0.98] transition-transform"
                >
                  <div className="relative h-32 bg-muted overflow-hidden">
                    <img
                      src={listing.image}
                      alt={listing.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black text-primary shadow-sm">
                      RM {listing.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-foreground truncate mb-1">
                      {listing.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {listing.stock}kg Left
                      </span>
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Block Reason Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-md rounded-t-[2.5rem] p-6 pb-10 animate-in slide-in-from-bottom duration-500 shadow-2xl border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <UserX className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  Block {farmerName}?
                </h3>
              </div>
              <button
                onClick={() => setIsBlockModalOpen(false)}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Please select a reason for blocking this user. This action will
              affect their overall farmer rating.
            </p>

            <div className="space-y-2 mb-8">
              {blockReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    selectedReason === reason
                      ? "bg-red-500/5 border-red-500 text-red-600 shadow-sm"
                      : "bg-background border-border text-foreground hover:border-red-500/30"
                  }`}
                >
                  <span className="text-sm font-semibold">{reason}</span>
                  {selectedReason === reason && (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsBlockModalOpen(false)}
                className="flex-1 bg-muted text-foreground font-bold py-4 rounded-2xl active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={handleBlock}
                className="flex-[2] bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-600/20 active:scale-95 transition-transform"
              >
                Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProfilePage;
