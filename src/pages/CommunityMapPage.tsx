import { useState } from "react";
import { MapPin, Navigation, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const markers = [
  { id: 1, type: "supply", name: "Green Garden Cafe", desc: "Surplus vegetables available", x: 35, y: 28, lat: 3.1390, lng: 101.6869 },
  { id: 2, type: "supply", name: "Ali's Farm", desc: "Fresh potatoes & chili", x: 65, y: 42, lat: 3.1450, lng: 101.7100 },
  { id: 3, type: "supply", name: "FreshMart Supermarket", desc: "End-of-day surplus produce", x: 22, y: 58, lat: 3.1300, lng: 101.6800 },
  { id: 4, type: "demand", name: "Shelter KL", desc: "Needs bread & ready-to-eat food", x: 50, y: 35, lat: 3.1520, lng: 101.6950 },
  { id: 5, type: "demand", name: "Community Kitchen", desc: "Needs vegetables & rice", x: 75, y: 65, lat: 3.1600, lng: 101.7200 },
  { id: 6, type: "demand", name: "Food Bank Malaysia", desc: "Accepting all food types", x: 40, y: 72, lat: 3.1250, lng: 101.6750 },
];

const legendItems = [
  { color: "bg-primary", label: "Extra Food Available" },
  { color: "bg-blue-500", label: "Organizations Requesting Food" },
];

const CommunityMapPage = () => {
  const [selected, setSelected] = useState<typeof markers[0] | null>(null);

  const openDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Community Food Map" showBack />

      <div className="px-4 py-4 space-y-4">
        <div className="flex gap-4 flex-wrap">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="relative w-full aspect-square bg-muted/30 rounded-2xl border border-border overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(10)].map((_, i) => (
              <div key={`h${i}`} className="absolute w-full border-t border-foreground" style={{ top: `${(i + 1) * 10}%` }} />
            ))}
            {[...Array(10)].map((_, i) => (
              <div key={`v${i}`} className="absolute h-full border-l border-foreground" style={{ left: `${(i + 1) * 10}%` }} />
            ))}
          </div>

          <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 100">
            <path d="M10 50 L90 50" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground" />
            <path d="M50 10 L50 90" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground" />
            <path d="M20 20 L80 80" stroke="currentColor" strokeWidth="1" fill="none" className="text-foreground" />
            <path d="M80 20 L20 80" stroke="currentColor" strokeWidth="1" fill="none" className="text-foreground" />
          </svg>

          {markers.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className="absolute flex flex-col items-center group"
              style={{ left: `${m.x}%`, top: `${m.y}%`, transform: "translate(-50%, -100%)" }}
            >
              <div className={`w-6 h-6 rounded-full ${m.type === "supply" ? "bg-primary" : "bg-blue-500"} flex items-center justify-center shadow-md`}>
                <MapPin className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="w-2 h-2 rounded-full bg-foreground/20 mt-0.5" />
              <div className="absolute bottom-full mb-1 bg-card border border-border rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <p className="text-xs font-medium text-foreground">{m.name}</p>
                <p className="text-[10px] text-muted-foreground">{m.desc}</p>
              </div>
            </button>
          ))}

          <div className="absolute top-3 left-3 bg-card/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-border">
            <p className="text-[10px] font-medium text-foreground">Kuala Lumpur Area</p>
          </div>
        </div>

        {/* Selected marker detail */}
        {selected && (
          <div className="bg-card rounded-xl p-4 border border-border space-y-3 animate-slide-up">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${selected.type === "supply" ? "bg-primary" : "bg-blue-500"} flex items-center justify-center`}>
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{selected.name}</p>
                  <p className="text-xs text-muted-foreground">{selected.desc}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Distance: <span className="font-medium text-foreground">3.2 km</span></p>
              <p className="text-sm text-muted-foreground">Estimated arrival: <span className="font-medium text-foreground">8 minutes</span></p>
            </div>
            <button onClick={() => openDirections(selected.lat, selected.lng)}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
              <Navigation className="w-4 h-4" /> Open Directions
            </button>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-foreground mb-3 text-sm">Nearby Food Activity</h3>
          <div className="space-y-2">
            {markers.map((m) => (
              <button key={m.id} onClick={() => setSelected(m)}
                className="w-full bg-card rounded-xl p-3 flex items-center gap-3 border border-border text-left">
                <div className={`w-8 h-8 rounded-full ${m.type === "supply" ? "bg-primary" : "bg-blue-500"} flex items-center justify-center`}>
                  <MapPin className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  m.type === "supply" ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-500"
                }`}>
                  {m.type === "supply" ? "Supply" : "Request"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityMapPage;
