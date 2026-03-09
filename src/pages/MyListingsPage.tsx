import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";

const MyListingsPage = () => {
  const { listings, currentUser } = useApp();
  const myListings = listings.filter((l) => l.sellerId === currentUser.id);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="My Listings" showBack />
      <div className="px-4 py-4 space-y-3">
        {myListings.length === 0 && (
          <p className="text-center text-muted-foreground py-10 text-sm">No listings yet</p>
        )}
        {myListings.map((l) => (
          <div key={l.id} className="bg-card rounded-xl p-3 flex items-center gap-3 border border-border">
            <div className="w-14 h-14 rounded-lg bg-primary-light flex items-center justify-center overflow-hidden">
              {l.image ? <img src={l.image} alt={l.name} className="w-full h-full object-contain" /> : <span className="text-2xl">🌱</span>}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm text-foreground">{l.name}</h3>
              <p className="text-primary font-bold text-sm">RM {l.price.toFixed(2)}/kg</p>
              <p className="text-xs text-muted-foreground">{l.stock} kg in stock</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyListingsPage;
