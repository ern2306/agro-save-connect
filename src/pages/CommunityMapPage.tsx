import { MapPin, Truck } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const markers = [
  { id: 1, type: "supply", name: "Green Garden Cafe", desc: "Surplus vegetables available", x: 35, y: 28, color: "bg-primary" },
  { id: 2, type: "supply", name: "Ali's Farm", desc: "Fresh potatoes & chili", x: 65, y: 42, color: "bg-primary" },
  { id: 3, type: "supply", name: "FreshMart Supermarket", desc: "End-of-day surplus produce", x: 22, y: 58, color: "bg-primary" },
  { id: 4, type: "demand", name: "Shelter KL", desc: "Needs bread & ready-to-eat food", x: 50, y: 35, color: "bg-blue-500" },
  { id: 5, type: "demand", name: "Community Kitchen", desc: "Needs vegetables & rice", x: 75, y: 65, color: "bg-blue-500" },
  { id: 6, type: "demand", name: "Food Bank Malaysia", desc: "Accepting all food types", x: 40, y: 72, color: "bg-blue-500" },
  { id: 7, type: "delivery", name: "Active Delivery", desc: "Tomatoes → Community Kitchen", x: 55, y: 50, color: "bg-yellow-500" },
  { id: 8, type: "delivery", name: "Active Delivery", desc: "Potatoes → Shelter KL", x: 30, y: 40, color: "bg-yellow-500" },
];

const legendItems = [
  { color: "bg-primary", label: "Extra Food Available" },
  { color: "bg-blue-500", label: "Organizations Requesting Food" },
  { color: "bg-yellow-500", label: "Active Deliveries" },
];

const CommunityMapPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Community Food Map" showBack />

      <div className="px-4 py-4 space-y-4">
        {/* Legend */}
        <div className="flex gap-4 flex-wrap">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Map visualization */}
        <div className="relative w-full aspect-square bg-muted/30 rounded-2xl border border-border overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(10)].map((_, i) => (
              <div key={`h${i}`} className="absolute w-full border-t border-foreground" style={{ top: `${(i + 1) * 10}%` }} />
            ))}
            {[...Array(10)].map((_, i) => (
              <div key={`v${i}`} className="absolute h-full border-l border-foreground" style={{ left: `${(i + 1) * 10}%` }} />
            ))}
          </div>

          {/* Road-like paths */}
          <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 100">
            <path d="M10 50 L90 50" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground" />
            <path d="M50 10 L50 90" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground" />
            <path d="M20 20 L80 80" stroke="currentColor" strokeWidth="1" fill="none" className="text-foreground" />
            <path d="M80 20 L20 80" stroke="currentColor" strokeWidth="1" fill="none" className="text-foreground" />
          </svg>

          {/* Markers */}
          {markers.map((m) => (
            <div
              key={m.id}
              className="absolute flex flex-col items-center group"
              style={{ left: `${m.x}%`, top: `${m.y}%`, transform: "translate(-50%, -100%)" }}
            >
              <div className={`w-6 h-6 rounded-full ${m.color} flex items-center justify-center shadow-md`}>
                {m.type === "delivery"
                  ? <Truck className="w-3 h-3 text-primary-foreground" />
                  : <MapPin className="w-3 h-3 text-primary-foreground" />
                }
              </div>
              <div className="w-2 h-2 rounded-full bg-foreground/20 mt-0.5" />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 bg-card border border-border rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <p className="text-xs font-medium text-foreground">{m.name}</p>
                <p className="text-[10px] text-muted-foreground">{m.desc}</p>
              </div>
            </div>
          ))}

          {/* Center label */}
          <div className="absolute top-3 left-3 bg-card/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-border">
            <p className="text-[10px] font-medium text-foreground">Kuala Lumpur Area</p>
          </div>
        </div>

        {/* Nearby list */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-sm">Nearby Food Activity</h3>
          <div className="space-y-2">
            {markers.map((m) => (
              <div key={m.id} className="bg-card rounded-xl p-3 flex items-center gap-3 border border-border">
                <div className={`w-8 h-8 rounded-full ${m.color} flex items-center justify-center`}>
                  {m.type === "delivery"
                    ? <Truck className="w-4 h-4 text-primary-foreground" />
                    : <MapPin className="w-4 h-4 text-primary-foreground" />
                  }
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  m.type === "supply" ? "bg-primary/10 text-primary" :
                  m.type === "demand" ? "bg-blue-500/10 text-blue-500" :
                  "bg-yellow-500/10 text-yellow-500"
                }`}>
                  {m.type === "supply" ? "Supply" : m.type === "demand" ? "Request" : "In Transit"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityMapPage;
