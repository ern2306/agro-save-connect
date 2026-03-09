import { useNavigate } from "react-router-dom";
import { User, Wallet, ShoppingBag, ChevronRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";

const MePage = () => {
  const { currentUser, walletBalance, listings } = useApp();
  const navigate = useNavigate();
  const myListings = listings.filter((l) => l.sellerId === currentUser.id);

  const menuItems = [
    { icon: User, label: "Profile", path: "/profile", desc: "Edit your details" },
    { icon: Wallet, label: "Wallet", path: "/wallet", desc: `RM ${walletBalance.toFixed(2)}` },
    { icon: ShoppingBag, label: "My Listings", path: "/my-listings", desc: `${myListings.length} items` },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Me" />

      <div className="px-4 py-6">
        {/* Avatar and info */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center text-3xl mb-2">
            {currentUser.avatar}
          </div>
          <h2 className="font-semibold text-foreground">{currentUser.username}</h2>
          <p className="text-sm text-muted-foreground">{currentUser.email}</p>
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full bg-card rounded-xl p-4 flex items-center gap-3 border border-border"
            >
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-sm text-foreground">{item.label}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MePage;
