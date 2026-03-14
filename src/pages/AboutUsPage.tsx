import {
  Leaf,
  Globe,
  Users,
  Award,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  ShieldCheck,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppContext";

const AboutUsPage = () => {
  const { t } = useApp();

  const stats = [
    { label: "Farmers Joined", value: "5,000+", icon: Users },
    { label: "Food Saved", value: "12,000 kg", icon: Leaf },
    { label: "Countries", value: "3", icon: Globe },
    { label: "Awards Won", value: "12", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-background pb-10 overflow-hidden">
      <PageHeader title={t("about_us")} showBack />

      <div className="px-6 py-8 space-y-10 relative">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 -mr-20 -mt-10" />

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Leaf className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter">
            AgroSave
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
            Our mission is to bridge the gap between farmers and consumers,
            reducing food waste and ensuring fresh produce for all.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-black text-foreground">
                  {stat.value}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Our Commitment
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We are dedicated to sustainable agriculture and food security. By
            empowering local farmers with AI-driven tools like Pest Detection,
            we help them protect their crops and livelihoods.
          </p>
        </div>

        {/* Contact & Social */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Connect With Us
          </h3>
          <div className="flex gap-3">
            <button className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm">
              <Instagram className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm">
              <Twitter className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm">
              <Facebook className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm">
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="text-center pt-4">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            © 2026 AgroSave Technologies Inc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
