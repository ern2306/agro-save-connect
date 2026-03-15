import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Heart,
  Truck,
  Package,
  Copy,
  Printer,
  Navigation,
  Minus,
  Plus,
  CheckCircle2,
  Gift,
  Building2,
  Clock,
  Star,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useApp, generateTrackingNumber } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";

type DonationStep =
  | "select"
  | "kg"
  | "confirmed"
  | "method"
  | "dropoff"
  | "pickup";

const foodMatchingOrgs = [
  {
    id: "r1",
    name: "Shelter KL",
    needs: "Bread / Ready-to-eat food",
    distance: "2.1 km",
    icon: "🏠",
    lat: 3.139,
    lng: 101.6869,
    rating: 4.8,
    category: "Shelter",
  },
  {
    id: "r2",
    name: "Community Kitchen",
    needs: "Bread / Bakery items",
    distance: "3.4 km",
    icon: "🍲",
    lat: 3.15,
    lng: 101.71,
    rating: 4.6,
    category: "Food Kitchen",
  },
  {
    id: "r3",
    name: "Food Bank Malaysia",
    needs: "Vegetables & Fresh Crops",
    distance: "3.2 km",
    icon: "🏦",
    lat: 3.13,
    lng: 101.68,
    rating: 4.9,
    category: "Food Bank",
  },
  {
    id: "r4",
    name: "Green Plate Restaurant",
    needs: "Surplus produce for daily meals",
    distance: "2.8 km",
    icon: "🍽️",
    lat: 3.145,
    lng: 101.695,
    rating: 4.5,
    category: "Restaurant",
  },
];

const getMatchingOrgs = (cropName: string) => {
  const vegCrops = [
    "potato",
    "tomato",
    "cucumber",
    "kangkung",
    "broccoli",
    "cabbage",
    "chili",
  ];
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
  const [selectedOrg, setSelectedOrg] = useState<
    (typeof foodMatchingOrgs)[0] | null
  >(null);
  const [donatedAmount, setDonatedAmount] = useState(0);
  const [donateKg, setDonateKg] = useState(1);
  const [trackingNumber, setTrackingNumber] = useState("");

  if (!listing) return <div className="p-4">Listing not found</div>;

  const matchingOrgs = getMatchingOrgs(listing.name);
  const donationAddress =
    "12, Jalan Bangsar Utama, Bangsar, 59000 Kuala Lumpur";

  const handleDonate = (org: (typeof foodMatchingOrgs)[0]) => {
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
    setListings(
      listings.map((l) =>
        l.id === id
          ? { ...l, isSurplus: true, stock: Math.max(0, l.stock - donateKg) }
          : l
      )
    );
    setStep("confirmed");
  };

  const handleSelectMethod = (method: "pickup" | "dropoff") => {
    if (method === "dropoff") {
      setNotifications([
        {
          id: `n${Date.now()}`,
          type: "donation" as const,
          title: "Donation Confirmed",
          message: `You donated ${donatedAmount}kg of ${listing.name} to ${selectedOrg?.name}. Drop-off location: ${donationAddress}. Please drop off within 2 days.`,
          orderId: "",
          timestamp: new Date(),
          read: false,
        },
        ...notifications,
      ]);
      toast.success("Thank you for donating surplus crops!");
      setStep("dropoff");
    } else {
      const trk = generateTrackingNumber();
      setTrackingNumber(trk);
      setNotifications([
        {
          id: `n${Date.now()}`,
          type: "donation" as const,
          title: "Donation Confirmed",
          message: `You donated ${donatedAmount}kg of ${listing.name} to ${selectedOrg?.name}. Tracking Number: ${trk}. Courier will pick up within 2 days.`,
          orderId: "",
          timestamp: new Date(),
          read: false,
        },
        ...notifications,
      ]);
      toast.success("Thank you for donating surplus crops!");
      setStep("pickup");
    }
  };

  const openGoogleMaps = (lat?: number, lng?: number) => {
    const dest =
      lat && lng ? `${lat},${lng}` : encodeURIComponent(donationAddress);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${dest}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Donate Surplus Crops" showBack />
      <div className="px-4 py-4 space-y-4">
        {/* Step: Select recipient */}
        {step === "select" && (
          <>
            {/* Premium crop card */}
            <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
              <div className="h-44 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-4 relative">
                <img
                  src={listing.image}
                  alt={listing.name}
                  className="h-full object-contain drop-shadow-md"
                />
                <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Gift className="w-3 h-3" /> Surplus
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-bold text-foreground text-lg">
                    {listing.name}
                  </h2>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    RM {listing.price.toFixed(2)}/kg
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-primary" />{" "}
                    {listing.stock} kg available
                  </span>
                </div>
              </div>
            </div>

            {/* AI Matching header */}
            <div className="flex items-center gap-2 px-1">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  AI-Matched Organizations
                </h3>
                <p className="text-xs text-muted-foreground">
                  Best matches based on crop type & proximity
                </p>
              </div>
            </div>

            {/* Organization cards */}
            <div className="space-y-3">
              {matchingOrgs.map((r) => (
                <div
                  key={r.id}
                  className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                        {r.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-sm text-foreground">
                            {r.name}
                          </h4>
                          <span className="text-[10px] bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full shrink-0">
                            {r.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {r.distance}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{" "}
                            {r.rating}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-primary shrink-0" />
                          <span className="truncate">Needs: {r.needs}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handleDonate(r)}
                      className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Heart className="w-4 h-4" /> Donate to {r.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step: Select KG */}
        {step === "kg" && (
          <div className="space-y-4">
            {/* Status banner */}
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Donating to {selectedOrg?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Specify the amount you want to donate
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                Donation Amount
              </p>
              <div className="flex items-center justify-center gap-8 mb-6">
                <button
                  onClick={() => setDonateKg(Math.max(1, donateKg - 1))}
                  className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground active:scale-90 transition-transform"
                >
                  <Minus className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black text-foreground">
                    {donateKg}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    Kilograms
                  </span>
                </div>
                <button
                  onClick={() =>
                    setDonateKg(Math.min(listing.stock, donateKg + 1))
                  }
                  className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground active:scale-90 transition-transform"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-6 px-2">
                <span>Min: 1kg</span>
                <span>Max: {listing.stock}kg</span>
              </div>
              <button
                onClick={handleConfirmDonate}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                Confirm {donateKg}kg Donation
              </button>
            </div>
          </div>
        )}

        {/* Step: Confirmed */}
        {step === "confirmed" && (
          <div className="space-y-4">
            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black text-foreground mb-2">
                Donation Confirmed
              </h2>
              <p className="text-sm text-muted-foreground mb-8">
                You have successfully donated{" "}
                <span className="font-bold text-foreground">
                  {donatedAmount}kg
                </span>{" "}
                of {listing.name} to {selectedOrg?.name}.
              </p>
              <div className="space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Choose Delivery Method
                </p>
                <button
                  onClick={() => handleSelectMethod("pickup")}
                  className="w-full p-4 rounded-2xl border border-border flex items-center gap-4 hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">Courier Pick-up</p>
                    <p className="text-xs text-muted-foreground">
                      We'll send a courier to your farm
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleSelectMethod("dropoff")}
                  className="w-full p-4 rounded-2xl border border-border flex items-center gap-4 hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">Self Drop-off</p>
                    <p className="text-xs text-muted-foreground">
                      Deliver to the organization yourself
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Drop Off */}
        {step === "dropoff" && (
          <div className="space-y-4">
            {/* Status banner */}
            <div className="bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">
                    Drop-off Required
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Please deliver within 2 business days
                  </p>
                </div>
              </div>
              <div className="bg-white/50 dark:bg-black/10 rounded-xl p-4 border border-primary/10">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-foreground leading-tight">
                      {donationAddress}
                    </p>
                    <button
                      onClick={() => openGoogleMaps()}
                      className="text-[10px] font-bold text-primary uppercase tracking-wider mt-2 flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" /> Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient info */}
            <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Recipient Organization
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl">
                  {selectedOrg?.icon}
                </div>
                <div>
                  <p className="font-bold text-sm">{selectedOrg?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedOrg?.category}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/my-listings")}
              className="w-full py-3 rounded-xl border border-border text-foreground font-medium text-sm"
            >
              Back to My Listings
            </button>
          </div>
        )}

        {/* Delivery Pick Up */}
        {step === "pickup" && (
          <div className="space-y-4">
            {/* Status banner */}
            <div className="bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">
                    Pick-Up Scheduled
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Courier arrives within 2 business days
                  </p>
                </div>
              </div>
              <div className="bg-white/50 dark:bg-black/10 rounded-xl p-3 border border-primary/10">
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  Tracking Number
                </p>
                <p className="text-lg font-bold text-primary tracking-wide">
                  {trackingNumber}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Actions
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(trackingNumber);
                    toast.success("Copied!");
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 bg-muted/30"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Number
                </button>
                <button
                  onClick={() => navigate(`/print-label/${trackingNumber}`)}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Shipping Label
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate("/my-listings")}
              className="w-full py-3 rounded-xl border border-border text-foreground font-medium text-sm"
            >
              Back to My Listings
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedOrg && step === "select" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border shadow-xl">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold text-foreground text-center text-base mb-1">
              Confirm Donation
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-5">
              Donate surplus{" "}
              <span className="font-semibold text-foreground">
                {listing.name}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-foreground">
                {selectedOrg.name}
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedOrg(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToKg}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-1.5"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonateSurplusPage;
