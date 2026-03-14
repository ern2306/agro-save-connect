import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin as MapPinIcon, ChevronRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import FreshnessIndicator from "@/components/FreshnessIndicator";

const ExplorePage = () => {
  const { listings, t } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filtered = listings.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const surplusListings = listings.filter((l) => l.isSurplus);
  const regularListings = filtered.filter((l) => !l.isSurplus);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title={t("explore")} showChat />

      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search plants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* Community Food Map Link */}
      <div className="px-4 mb-3">
        <button
          onClick={() => navigate("/community-map")}
          className="w-full bg-primary/10 rounded-xl p-3 flex items-center gap-3 border border-primary/20 hover:bg-primary/15 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <MapPinIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="text-left flex-1">
            <h3 className="font-medium text-sm text-foreground">
              🗺️ {t("community_map")}
            </h3>
            <p className="text-xs text-muted-foreground">
              View nearby food supply & demand in real-time
            </p>
          </div>
        </button>
      </div>

      {/* Rescue Crops Section */}
      {surplusListings.length > 0 && (
        <div className="px-4 mb-4">
          <h2 className="font-semibold text-foreground mb-1 flex items-center gap-2">
            ♻️ Rescue Crops
          </h2>
          <p className="text-xs text-muted-foreground mb-3">
            Help reduce food waste by purchasing surplus harvest from farmers.
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {surplusListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-card rounded-xl overflow-hidden shadow-sm border border-primary/30 text-left min-w-[150px] flex-shrink-0 transition-transform active:scale-[0.98] flex flex-col"
              >
                <div
                  className="relative aspect-square bg-primary-light flex items-center justify-center p-3 cursor-pointer"
                  onClick={() => navigate(`/order/${listing.id}`)}
                >
                  <img
                    src={listing.image}
                    alt={listing.name}
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Surplus
                  </span>
                </div>
                <div className="p-2.5 flex-1 flex flex-col">
                  <div
                    onClick={() => navigate(`/order/${listing.id}`)}
                    className="cursor-pointer mb-2"
                  >
                    <h3 className="font-medium text-foreground text-xs">
                      {listing.name}
                    </h3>
                    <p className="text-primary font-bold text-xs">
                      RM {listing.price.toFixed(2)}/kg
                    </p>
                    <p className="text-muted-foreground text-[10px]">
                      {listing.stock} kg left
                    </p>
                    {listing.freshness && (
                      <FreshnessIndicator level={listing.freshness} compact />
                    )}
                  </div>

                  {/* Farmer Info - Clickable */}
                  <button
                    onClick={() => navigate(`/farmer/${listing.sellerId}`)}
                    className="mt-auto flex items-center justify-between p-1.5 bg-muted/50 rounded-lg hover:bg-primary/5 transition-colors group/btn"
                  >
                    <span className="text-[9px] font-bold text-foreground truncate">
                      by {listing.seller}
                    </span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4">
        <h2 className="font-semibold text-foreground mb-3">Fresh Crops</h2>
        <div className="grid grid-cols-2 gap-3">
          {regularListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-card rounded-xl overflow-hidden shadow-sm border border-border text-left transition-transform active:scale-[0.98] flex flex-col"
            >
              <div
                className="aspect-square bg-primary-light flex items-center justify-center p-4 cursor-pointer"
                onClick={() => navigate(`/order/${listing.id}`)}
              >
                <img
                  src={listing.image}
                  alt={listing.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div
                  onClick={() => navigate(`/order/${listing.id}`)}
                  className="cursor-pointer mb-2"
                >
                  <h3 className="font-medium text-foreground text-sm">
                    {listing.name}
                  </h3>
                  <p className="text-primary font-bold text-sm">
                    RM {listing.price.toFixed(2)}/kg
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {listing.stock} kg left
                  </p>
                  {listing.freshness && (
                    <div className="mt-1">
                      <FreshnessIndicator level={listing.freshness} compact />
                    </div>
                  )}
                  {listing.source && (
                    <p className="text-muted-foreground text-[10px] mt-0.5">
                      📍 {listing.source.name} · {listing.source.distance} km
                    </p>
                  )}
                </div>

                {/* Farmer Info - Clickable */}
                <button
                  onClick={() => navigate(`/farmer/${listing.sellerId}`)}
                  className="mt-auto flex items-center justify-between p-2 bg-muted/50 rounded-xl hover:bg-primary/5 transition-colors group/btn"
                >
                  <span className="text-[10px] font-bold text-foreground truncate">
                    by {listing.seller}
                  </span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {regularListings.length === 0 && (
          <p className="text-center text-muted-foreground py-10">
            No crops found
          </p>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
