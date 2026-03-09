import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";

const ExplorePage = () => {
  const { listings } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filtered = listings.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Explore" showChat />

      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search plants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="px-4">
        <h2 className="font-semibold text-foreground mb-3">Fresh Crops</h2>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((listing) => (
            <button
              key={listing.id}
              onClick={() => navigate(`/order/${listing.id}`)}
              className="bg-card rounded-xl overflow-hidden shadow-sm border border-border text-left transition-transform active:scale-[0.98]"
            >
              <div className="aspect-square bg-primary-light flex items-center justify-center p-4">
                <img src={listing.image} alt={listing.name} className="w-full h-full object-contain" />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-foreground text-sm">{listing.name}</h3>
                <p className="text-primary font-bold text-sm">RM {listing.price.toFixed(2)}/kg</p>
                <p className="text-muted-foreground text-xs">{listing.stock} kg left</p>
                <p className="text-muted-foreground text-xs mt-1">by {listing.seller}</p>
              </div>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-10">No crops found</p>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
