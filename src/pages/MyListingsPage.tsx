import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";

const MyListingsPage = () => {
  const { listings, setListings, currentUser } = useApp();
  const navigate = useNavigate();
  const myListings = listings.filter((l) => l.sellerId === currentUser.id);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setListings(listings.filter((l) => l.id !== id));
    setDeleteId(null);
    toast.success("Listing deleted");
  };

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
            <div className="flex gap-2">
              <button onClick={() => navigate(`/edit-listing/${l.id}`)}
                className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                <Pencil className="w-3.5 h-3.5 text-primary" />
              </button>
              <button onClick={() => setDeleteId(l.id)}
                className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
            <h3 className="font-semibold text-foreground text-center mb-2">Delete Listing?</h3>
            <p className="text-sm text-muted-foreground text-center mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-medium text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;
