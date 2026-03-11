import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Heart } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";

const recipients = [
  { id: "r1", name: "Food Bank Malaysia", distance: "3.2 km", accepts: "Vegetables & Fresh Crops", icon: "🏦" },
  { id: "r2", name: "Community Kitchen NGO", distance: "4.5 km", accepts: "Tomatoes, Cucumbers, Potatoes", icon: "🍲" },
  { id: "r3", name: "Green Plate Restaurant", distance: "2.8 km", accepts: "Surplus produce for daily meals", icon: "🍽️" },
];

const DonateSurplusPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, setListings, notifications, setNotifications } = useApp();
  const listing = listings.find((l) => l.id === id);
  const [confirmTarget, setConfirmTarget] = useState<typeof recipients[0] | null>(null);

  if (!listing) return <div className="p-4">Listing not found</div>;

  const handleConfirmDonate = () => {
    if (!confirmTarget) return;
    // Mark listing as surplus and reduce stock
    setListings(listings.map((l) =>
      l.id === id ? { ...l, isSurplus: true, stock: Math.max(0, l.stock - Math.ceil(l.stock * 0.5)) } : l
    ));
    setNotifications([
      {
        id: `n${Date.now()}`, type: "order_confirmed" as const, title: "Donation Successful",
        message: `Your surplus ${listing.name} has been donated to ${confirmTarget.name}. Thank you for supporting food security.`,
        orderId: "", timestamp: new Date(), read: false,
      },
      ...notifications,
    ]);
    toast.success("Thank you for donating surplus crops and helping reduce food waste.");
    setConfirmTarget(null);
    navigate("/my-listings");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Donate Surplus Crops" showBack />
      <div className="px-4 py-4 space-y-4">
        {/* Crop Info */}
        <div className="bg-card rounded-xl overflow-hidden border border-border">
          <div className="h-40 bg-primary-light flex items-center justify-center p-4">
            <img src={listing.image} alt={listing.name} className="h-full object-contain" />
          </div>
          <div className="p-4">
            <h2 className="font-semibold text-foreground text-lg">{listing.name}</h2>
            <p className="text-sm text-muted-foreground">Remaining Stock: {listing.stock} kg</p>
            <p className="text-sm text-muted-foreground">Price: RM {listing.price.toFixed(2)}/kg</p>
          </div>
        </div>

        {/* Recipients */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            Recommended Donation Recipients
          </h3>
          <div className="space-y-3">
            {recipients.map((r) => (
              <div key={r.id} className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-2xl shrink-0">
                    {r.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-foreground">{r.name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {r.distance}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Accepts: {r.accepts}</p>
                  </div>
                </div>
                <button onClick={() => setConfirmTarget(r)}
                  className="w-full mt-3 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" /> Donate
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
            <h3 className="font-semibold text-foreground text-center mb-2">Confirm Surplus Donation</h3>
            <p className="text-sm text-muted-foreground text-center mb-5">
              Are you sure you want to donate your surplus <span className="font-medium text-foreground">{listing.name}</span> to <span className="font-medium text-foreground">{confirmTarget.name}</span>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-medium text-sm">Cancel</button>
              <button onClick={handleConfirmDonate}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Confirm Donation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonateSurplusPage;
