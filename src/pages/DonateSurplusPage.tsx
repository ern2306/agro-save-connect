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

  const donationId = `n${Date.now()}`;
  const donationDate = new Date().toLocaleString();

  if (method === "dropoff") {

    setNotifications([
      {
        id: donationId,
        type: "donation",
        title: "Donation Confirmed",
        message: `You donated ${donatedAmount}kg of ${listing.name} to ${selectedOrg?.name}.`,
        orderId: "",
        timestamp: new Date(),
        read: false,
      },
      ...notifications,
    ]);

    toast.success("Thank you for donating surplus crops!");

    navigate(`/donation/${donationId}`, {
      state: {
        crop: listing.name,
        kg: donatedAmount,
        org: selectedOrg?.name,
        method: "Drop-off",
        address: donationAddress,
        date: donationDate,
        status: "Awaiting Drop-off"
      }
    });

  } else {

    const trk = generateTrackingNumber();
    setTrackingNumber(trk);

    setNotifications([
      {
        id: donationId,
        type: "donation",
        title: "Donation Confirmed",
        message: `You donated ${donatedAmount}kg of ${listing.name} to ${selectedOrg?.name}.`,
        orderId: "",
        timestamp: new Date(),
        read: false,
      },
      ...notifications,
    ]);

    toast.success("Thank you for donating surplus crops!");

    navigate(`/donation/${donationId}`, {
      state: {
        crop: listing.name,
        kg: donatedAmount,
        org: selectedOrg?.name,
        method: "Pickup",
        tracking: trk,
        date: donationDate,
        status: "Courier Scheduled"
      }
    });

  }
};
  const openGoogleMaps = (lat?: number, lng?: number) => {
    const dest = lat && lng ? `${lat},${lng}` : encodeURIComponent(donationAddress);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Donate Surplus Crops" showBack />
      <div className="px-4 py-4 space-y-4">

        {/* Step: Select recipient */}
        {step === "select" && (
          <>
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

            <div>
              <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                🤖 Best Matching Organizations
              </h3>
              <p className="text-xs text-muted-foreground mb-3">AI-matched based on your crop type and proximity</p>
              <div className="space-y-3">
                {matchingOrgs.map((r) => (
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
                        <p className="text-xs text-muted-foreground mt-0.5">Needs: {r.needs}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDonate(r)}
                      className="w-full mt-3 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
                      <Heart className="w-4 h-4" /> Donate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step: Select KG */}
        {step === "kg" && (
          <div className="space-y-4">
            <div className="bg-card rounded-xl p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-1">Donating to {selectedOrg?.name}</h3>
              <p className="text-xs text-muted-foreground">Select how many kg to donate</p>
            </div>

            <div className="bg-card rounded-xl p-4 border border-border">
              <label className="text-sm font-medium text-foreground mb-3 block">Donation Amount (kg)</label>
              <div className="flex items-center gap-4 mb-3">
                <button onClick={() => setDonateKg(Math.max(1, donateKg - 1))} className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                  <Minus className="w-4 h-4 text-primary" />
                </button>
                <input
                  type="number"
                  value={donateKg}
                  onChange={(e) => {
                    const v = parseInt(e.target.value) || 1;
                    setDonateKg(Math.max(1, Math.min(listing.stock, v)));
                  }}
                  className="w-20 text-center text-lg font-semibold bg-background border border-border rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  min={1}
                  max={listing.stock}
                />
                <button onClick={() => setDonateKg(Math.min(listing.stock, donateKg + 1))} className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                  <Plus className="w-4 h-4 text-primary" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Available: {listing.stock} kg</p>
            </div>

            <button onClick={handleConfirmDonate}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
              Confirm Donation ({donateKg} kg)
            </button>
          </div>
        )}

        {/* Donation Confirmed - show amount and method selection */}
        {step === "confirmed" && (
          <div className="space-y-4">
            <div className="bg-accent/30 rounded-xl p-6 text-center">
              <p className="text-3xl mb-2">✅</p>
              <h3 className="font-semibold text-foreground text-lg">Donation Confirmed</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You donated <span className="font-bold text-foreground">{donatedAmount} kg</span> of {listing.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">to {selectedOrg?.name}</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Select Delivery Method</h3>
              <div className="space-y-3">
                <button onClick={() => handleSelectMethod("pickup")}
                  className="w-full bg-card rounded-xl p-4 border border-border flex items-center gap-3 text-left">
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">Delivery Pick Up</h4>
                    <p className="text-xs text-muted-foreground">Courier will come pick up your donation</p>
                  </div>
                </button>
                <button onClick={() => handleSelectMethod("dropoff")}
                  className="w-full bg-card rounded-xl p-4 border border-border flex items-center gap-3 text-left">
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">Drop Off at Location</h4>
                    <p className="text-xs text-muted-foreground">Deliver your donation to the organization</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drop Off */}
        {step === "dropoff" && (
          <div className="space-y-4">
            <div className="bg-accent/30 rounded-xl p-5 text-center">
              <p className="text-2xl mb-2">📍</p>
              <p className="text-sm font-semibold text-foreground">Please drop off your donation at:</p>
              <p className="text-sm text-muted-foreground mt-2">{donationAddress}</p>
              <p className="text-xs text-muted-foreground mt-1">Within 2 days.</p>
            </div>

            {/* Distance & arrival estimate */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-sm text-muted-foreground">Distance: <span className="font-medium text-foreground">4.5 km</span></p>
              <p className="text-sm text-muted-foreground">Estimated arrival: <span className="font-medium text-foreground">10 minutes</span></p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => openGoogleMaps()}
                className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
                <Map className="w-4 h-4" /> Open Map
              </button>
              <button onClick={() => openGoogleMaps()}
                className="flex-1 py-3 rounded-xl border border-primary text-primary font-semibold text-sm flex items-center justify-center gap-2">
                <Navigation className="w-4 h-4" /> View Directions
              </button>
            </div>
            <button onClick={() => navigate("/my-listings")} className="w-full py-3 rounded-xl border border-border text-foreground font-medium text-sm">
              Back to My Listings
            </button>
          </div>
        )}

        {/* Delivery Pick Up */}
        {step === "pickup" && (
          <div className="space-y-4">
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-xs font-semibold text-foreground mb-2">Tracking Number</p>
              <p className="text-lg font-bold text-primary mb-3">{trackingNumber}</p>
              <div className="flex gap-2">
                <button onClick={() => { navigator.clipboard.writeText(trackingNumber); toast.success("Copied!"); }}
                  className="flex-1 py-2 rounded-lg border border-border text-foreground text-xs font-medium flex items-center justify-center gap-1.5">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
                <button onClick={() => navigate(`/print-label/${trackingNumber}`)}
                  className="flex-1 py-2 rounded-lg border border-border text-foreground text-xs font-medium flex items-center justify-center gap-1.5">
                  <Printer className="w-3.5 h-3.5" /> Print Label
                </button>
              </div>
            </div>

            <div className="bg-accent/30 rounded-xl p-5 text-center">
              <p className="text-2xl mb-2">📦</p>
              <p className="text-sm font-semibold text-foreground">Courier will pick up within 2 days</p>
            </div>

            <button onClick={() => navigate("/my-listings")} className="w-full py-3 rounded-xl border border-border text-foreground font-medium text-sm">
              Back to My Listings
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal - now proceeds to KG step */}
      {selectedOrg && step === "select" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
            <h3 className="font-semibold text-foreground text-center mb-2">Confirm Surplus Donation</h3>
            <p className="text-sm text-muted-foreground text-center mb-5">
              Are you sure you want to donate your surplus <span className="font-medium text-foreground">{listing.name}</span> to <span className="font-medium text-foreground">{selectedOrg.name}</span>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setSelectedOrg(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-medium text-sm">Cancel</button>
              <button onClick={handleProceedToKg}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonateSurplusPage;
