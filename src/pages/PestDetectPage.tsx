import { useState } from "react";
import { Camera, ShieldCheck, AlertTriangle, Droplets, Leaf, Bug } from "lucide-react";
import PageHeader from "@/components/PageHeader";

type ScanResult = null | "clean" | "infected";

const PestDetectPage = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult>(null);

  const handleScan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      setResult(Math.random() > 0.5 ? "infected" : "clean");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Pest Detect" showBack />

      <div className="px-4 py-6 flex flex-col items-center">
        {/* Scan area */}
        <div className="w-64 h-64 rounded-2xl border-4 border-dashed border-primary/40 bg-primary-light flex items-center justify-center mb-6 relative overflow-hidden">
          {scanning ? (
            <div className="animate-pulse flex flex-col items-center gap-2">
              <div className="w-full h-1 bg-primary/40 absolute top-0 animate-bounce" />
              <Camera className="w-16 h-16 text-primary/60" />
              <p className="text-primary text-sm font-medium">Scanning...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Camera className="w-16 h-16 text-primary/40" />
              <p className="text-muted-foreground text-sm">Point at your plant</p>
            </div>
          )}
        </div>

        <button
          onClick={handleScan}
          disabled={scanning}
          className="w-full max-w-xs py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 transition-opacity"
        >
          {scanning ? "Scanning..." : "Scan Plant"}
        </button>

        {/* Results */}
        {result === "clean" && (
          <div className="mt-6 w-full max-w-xs bg-accent rounded-xl p-4 animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-success" />
              <h3 className="font-semibold text-accent-foreground">No Pests Detected!</h3>
            </div>
            <p className="text-sm text-muted-foreground">Your plant looks healthy. Keep up the good work!</p>
          </div>
        )}

        {result === "infected" && (
          <div className="mt-6 w-full max-w-xs space-y-3 animate-slide-up">
            <div className="bg-destructive/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-6 h-6 text-destructive" />
                <h3 className="font-semibold text-destructive">Pests Detected!</h3>
              </div>
              <p className="text-sm text-muted-foreground">We found signs of pest infection. Here are some suggestions:</p>
            </div>

            <div className="space-y-2">
              {[
                { icon: Leaf, title: "Add more nutrients", desc: "Mix 2 tablespoons of compost fertilizer with 1 litre of water and apply to the soil base every 3 days" },
                { icon: Droplets, title: "Increase watering", desc: "Add 2 cups (500ml) of water twice daily — once at 7AM and again at 6PM — directly to the root area" },
                { icon: Bug, title: "Apply pest control", desc: "Dilute 5ml of neem oil in 1 litre of water and spray on both sides of leaves every 5 days for 2 weeks" },
              ].map((s, i) => (
                <div key={i} className="bg-card rounded-xl p-3 flex items-start gap-3 border border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                    <s.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{s.title}</h4>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PestDetectPage;
