import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Heart, Truck, Package, Copy, Printer, Map, Navigation, Minus, Plus } from "lucide-react";
import { useApp, generateTrackingNumber } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";

type DonationStep = "select" | "kg" | "confirmed" | "method" | "dropoff" | "pickup";

const foodMatchingOrgs = [
  { id: "r1", name: "Shelter KL", needs: "Bread / Ready-to-eat food", distance: "2.1 km", icon: "🏠", lat: 3.1390, lng: 101.6869 },
  { id: "r2", name: "Community Kitchen", needs: "Bread / Bakery items", distance: "3.4 km", icon: "🍲", lat: 3.1500, lng: 101.7100 },
  { id: "r3", name: "Food Bank Malaysia", needs: "Vegetables & Fresh Crops", distance: "3.2 km", icon: "🏦", lat: 3.1300, lng: 101.6800 },
  { id: "r4", name: "Green Plate Restaurant", needs: "Surplus produce for daily meals", distance: "2.8 km", icon: "🍽️", lat: 3.1450, lng: 101.6950 },
];

const getMatchingOrgs = (cropName: string) => {
  const vegCrops = ["potato", "tomato", "cucumber", "kangkung", "broccoli", "cabbage", "chili"];
  const isVeg = vegCrops.some((v) => cropName.toLowerCase().includes(v));
  return foodMatchingOrgs.map((org) => ({
    ...org,
    needs: isVeg ? `${cropName}, Vegetables & Fresh Produce` : org.needs,
  }));
};

const DonateSurplusPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, setListings, notifications, setNotifications } = useApp();
  const listing = listings.find((l) => l.id === id);
  const [step, setStep] = useState<DonationStep>("select");
  const [selectedOrg, setSelectedOrg] = useState<typeof foodMatchingOrgs[0] | null>(null);
  const [donatedAmount, setDonatedAmount] = useState(0);
  const [donateKg, setDonateKg] = useState(1);
  const [trackingNumber, setTrackingNumber] = useState("");

  if (!listing) return <div className="p-4">Listing not found</div>;

  const matchingOrgs = getMatchingOrgs(listing.name);
  const donationAddress = "12, Jalan Bangsar Utama, Bangsar, 59000 Kuala Lumpur";

  const handleDonate = (org: typeof foodMatchingOrgs[0]) => {
    setSelectedOrg(org);
  };

  const handleProceedToKg = () => {
    if (!selectedOrg) return;
    setDonateKg(Math.min(Math.ceil(listing.stock * 0.5), listing.stock));
    setStep("kg");
  };

  const handleConfirmDonate = () => {
    if (!selectedOrg) return;
    setDonatedAmount(donateKg);
    setListings(listings.map((l) =>
      l.id === id ? { ...l, isSurplus: true, stock: Math.max(0, l.stock - donateKg) } : l
    ));
    setStep("confirmed");
  };

  const handleSelectMethod = (method: "pickup" | "dropoff") => {
    if (method === "dropoff") {
      const donationId = `d${Date.now()}`;
      // Add notification with drop-off info and enhanced donation data
      setNotifications([
        {
          id: `n${Date.now()}`, type: "donation" as const, title: "🎉 Donation Confirmed!",
          message: `You donated ${donatedAmount}kg of ${listing.name} to ${selectedOrg?.name}. Drop-off location: ${donationAddress}. Please drop off within 2 days.`,
          orderId: donationId, timestamp: new Date(), read: false,
          donationData: {
            crop: listing.name,
            kg: donatedAmount,
            org: selectedOrg?.name || "",
            method: "dropoff",
            address: donationAddress,
            date: new Date().toISOString(),
          },
        },
        ...notifications,
      ]);
      toast.success("Thank you for donating surplus crops!");
      setStep("dropoff");
    } else {
      const trk = generateTrackingNumber();
      setTrackingNumber(trk);
      const donationId = `d${Date.now()}`;
      // Add notification with tracking number and enhanced donation data
      setNotifications([
        {
          id: `n${Date.now()}`, type: "donation" as const, title: "🎉 Donation Confirmed!",
          message: `You donated ${donatedAmount}kg of ${listing.name} to ${selectedOrg?.name}. Tracking Number: ${trk}. Courier will pick up within 2 days.`,
          orderId: donationId, timestamp: new Date(), read: false,
          donationData: {
            crop: listing.name,
            kg: donatedAmount,
            org: selectedOrg?.name || "",
            method: "pickup",
            tracking: trk,
            date: new Date().toISOString(),
          },
        },
        ...notifications,
      ]);
      toast.success("Thank you for donating surplus crops!");
      setStep("pickup");
    }
  };

  const openGoogleMaps = (lat?: number, lng?: number) => {
    const dest = lat && lng ? `${lat},${lng}` : encodeURIComponent(donationAddress);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Donate Surplus Crops" showBack />

      {step === "select" && (
        <div className="px-4 py-4 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Select Organization</h2>
          <p className="text-sm text-muted-foreground">
            You're donating <strong>{listing.name}</strong> from your surplus stock
          </p>
          <div className="space-y-3">
            {matchingOrgs.map((org) => (
              <button
                key={org.id}
                onClick={() => handleDonate(org)}
                className="w-full bg-card rounded-xl border border-border p-4 text-left hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{org.icon}</span>
                      <div>
                        <h3 className="font-semibold text-foreground">{org.name}</h3>
                        <p className="text-xs text-muted-foreground">{org.needs}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <MapPin className="w-4 h-4 text-primary inline" />
                    <p className="text-xs text-muted-foreground">{org.distance}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {selectedOrg && (
            <button
              onClick={handleProceedToKg}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium"
            >
              Proceed to Select Amount
            </button>
          )}
        </div>
      )}

      {step === "kg" && (
        <div className="px-4 py-4 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">How much do you want to donate?</h2>
          <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Amount (kg):</span>
              <span className="text-2xl font-bold text-primary">{donateKg}</span>
            </div>
            <input
              type="range"
              min="1"
              max={listing.stock}
              value={donateKg}
              onChange={(e) => setDonateKg(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 kg</span>
              <span>{listing.stock} kg available</span>
            </div>
          </div>
          <button
            onClick={handleConfirmDonate}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium"
          >
            Confirm Amount
          </button>
        </div>
      )}

      {step === "confirmed" && (
        <div className="px-4 py-4 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Confirm Your Donation</h2>
          <div className="bg-card rounded-xl border border-border p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Crop:</span>
              <span className="font-medium text-foreground">{listing.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium text-foreground">{donatedAmount} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Organization:</span>
              <span className="font-medium text-foreground">{selectedOrg?.name}</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">How do you want to deliver?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSelectMethod("dropoff")}
                className="bg-card rounded-lg border border-border p-3 hover:border-primary transition-colors text-center"
              >
                <MapPin className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Drop-off</p>
              </button>
              <button
                onClick={() => handleSelectMethod("pickup")}
                className="bg-card rounded-lg border border-border p-3 hover:border-primary transition-colors text-center"
              >
                <Truck className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Pickup</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "dropoff" && (
        <div className="px-4 py-4 space-y-4">
          <div className="bg-success/10 border border-success rounded-xl p-4 text-center">
            <Heart className="w-8 h-8 text-success mx-auto mb-2" />
            <h3 className="font-semibold text-foreground">Thank You for Your Donation!</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Your {donatedAmount}kg of {listing.name} will help those in need.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 space-y-3">
            <h4 className="font-semibold text-foreground">Drop-off Details</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Location:</strong> {donationAddress}</p>
              <p><strong>Deadline:</strong> Within 2 days</p>
            </div>
            <button
              onClick={() => openGoogleMaps()}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Open in Maps
            </button>
          </div>

          <button
            onClick={() => navigate("/notifications")}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium"
          >
            View Donation in Notifications
          </button>
        </div>
      )}

      {step === "pickup" && (
        <div className="px-4 py-4 space-y-4">
          <div className="bg-success/10 border border-success rounded-xl p-4 text-center">
            <Heart className="w-8 h-8 text-success mx-auto mb-2" />
            <h3 className="font-semibold text-foreground">Thank You for Your Donation!</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Your {donatedAmount}kg of {listing.name} will help those in need.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 space-y-3">
            <h4 className="font-semibold text-foreground">Pickup Details</h4>
            <div className="bg-primary/10 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Tracking Number</p>
              <p className="text-lg font-bold text-primary font-mono">{trackingNumber}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(trackingNumber);
                  toast.success("Tracking number copied!");
                }}
                className="mt-2 text-xs text-primary hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Pickup Window:</strong> Within 2 days</p>
              <p><strong>Status:</strong> Courier will contact you</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/notifications")}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium"
          >
            View Donation in Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default DonateSurplusPage;