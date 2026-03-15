import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { FreshnessLevel } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import FreshnessIndicator from "@/components/FreshnessIndicator";
import { toast } from "sonner";

const sourceTypes = ["Farm", "Restaurant", "Supermarket", "Community Donor"] as const;

const AddListingPage = () => {
  const { listings, setListings, currentUser } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Freshness fields - always shown, default to 3
  const [freshness, setFreshness] = useState<FreshnessLevel>(3);
  const [bestBefore, setBestBefore] = useState("");

  // Food source fields - always shown with defaults
  const [sourceName, setSourceName] = useState("");
  const [sourceType, setSourceType] = useState<typeof sourceTypes[number]>("Farm");
  const [sourceLocation, setSourceLocation] = useState("");
  const [sourceDistance, setSourceDistance] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name || !price || !stock) {
      toast.error("Please fill in all required fields");
      return;
    }
    // Fix 2: Always include freshness and source (with defaults if not filled)
    const newListing = {
      id: Date.now().toString(),
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      image: imagePreview || "",
      seller: currentUser.username,
      sellerId: currentUser.id,
      freshness,
      bestBefore: bestBefore || undefined,
      source: {
        name: sourceName || `${currentUser.username}'s Source`,
        type: sourceType,
        location: sourceLocation || currentUser.address || "Malaysia",
        distance: parseFloat(sourceDistance) || 0,
      },
    };
    setListings([newListing, ...listings]);
    toast.success("Listing added successfully!");
    navigate("/explore");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Add Listing" showBack />
      <div className="px-4 py-6 space-y-4">
        {/* Image Upload */}
        <label className="block cursor-pointer">
          <div className="w-full h-48 rounded-xl border-2 border-dashed border-primary/30 bg-primary-light flex flex-col items-center justify-center overflow-hidden">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <ImagePlus className="w-10 h-10 text-primary/50 mb-2" />
                <p className="text-sm text-muted-foreground">Upload plant photo</p>
              </>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Plant Name <span className="text-destructive">*</span></label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Tomato"
            className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Price per kg (RM) <span className="text-destructive">*</span></label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder="0.00"
            className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Stock (kg) <span className="text-destructive">*</span></label>
          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            type="number"
            placeholder="0"
            className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Freshness Level - always shown */}
        <div className="bg-card rounded-xl p-4 border border-border space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Food Freshness</h3>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Freshness Level (1 = Low, 5 = Very Fresh)</label>
            <div className="flex gap-2">
              {([1, 2, 3, 4, 5] as FreshnessLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFreshness(level)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    freshness === level
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-foreground"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <FreshnessIndicator level={freshness} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Best Before</label>
            <input
              value={bestBefore}
              onChange={(e) => setBestBefore(e.target.value)}
              placeholder="e.g. 3 days"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Food Source - always shown, optional fields but source always saved */}
        <div className="bg-card rounded-xl p-4 border border-border space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Food Source</h3>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Source Name <span className="text-muted-foreground font-normal">(optional)</span></label>
            <input
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="e.g. Ali's Farm"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Source Type</label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value as typeof sourceTypes[number])}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {sourceTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Location <span className="text-muted-foreground font-normal">(optional)</span></label>
            <input
              value={sourceLocation}
              onChange={(e) => setSourceLocation(e.target.value)}
              placeholder="e.g. Serdang, Selangor"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Distance from you (km) <span className="text-muted-foreground font-normal">(optional)</span></label>
            <input
              value={sourceDistance}
              onChange={(e) => setSourceDistance(e.target.value)}
              type="number"
              placeholder="0.0"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm mt-4"
        >
          Add Listing
        </button>
      </div>
    </div>
  );
};

export default AddListingPage;
