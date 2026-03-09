import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";

const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState(currentUser.username);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);

  const handleSave = () => {
    setCurrentUser({ ...currentUser, username, phone, email });
    toast.success("Profile updated!");
  };

  const handleLogout = () => {
    toast.info("Logged out");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Profile" showBack />
      <div className="px-4 py-6 space-y-4">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center text-4xl">
            {currentUser.avatar}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>

        <button onClick={handleSave} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
          Save Changes
        </button>

        <button onClick={handleLogout} className="w-full py-3 rounded-xl border border-destructive text-destructive font-semibold text-sm flex items-center justify-center gap-2 mt-4">
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
