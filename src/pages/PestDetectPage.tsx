import { useState, useRef } from "react";
import {
  Camera,
  ShieldCheck,
  AlertTriangle,
  Droplets,
  Leaf,
  Bug,
  History,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppContext";
import type { ScanRecord } from "@/context/AppContext";

type ScanResult = null | "clean" | "infected";

const plantNames = [
  "Tomato",
  "Chili Plant",
  "Cucumber",
  "Kangkung",
  "Broccoli",
  "Potato",
  "Cabbage",
];

const defaultTreatment = {
  nutrient:
    "Add Nitrogen fertilizer: 10g per plant. Mix 2 tablespoons of compost fertilizer with 1 litre of water and apply every 3 days.",
  watering:
    "Water 2 times per day. Add 2 cups (500ml) at 7AM and 6PM directly to the root area.",
  pesticide:
    "Spray organic pesticide every 3 days. Dilute 5ml of neem oil in 1 litre of water and spray on both sides of leaves for 2 weeks.",
};

const PestDetectPage = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult>(null);
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);
  const { scanHistory, setScanHistory } = useApp();
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const healthyCount = scanHistory.filter((s) => s.result === "Healthy").length;
  const diseasedCount = scanHistory.filter(
    (s) => s.result === "Pest Detected"
  ).length;

  const handleScan = () => {
    // Trigger the camera input
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Start the scanning animation
    setScanning(true);
    setResult(null);

    setTimeout(() => {
      setScanning(false);
      const isInfected = Math.random() > 0.5;
      const scanResult: ScanResult = isInfected ? "infected" : "clean";
      setResult(scanResult);

      const plantName =
        plantNames[Math.floor(Math.random() * plantNames.length)];
      const record: ScanRecord = {
        id: `scan${Date.now()}`,
        plantName,
        result: isInfected ? "Pest Detected" : "Healthy",
        timestamp: new Date(),
        treatment: isInfected ? defaultTreatment : undefined,
      };
      setScanHistory((prev) => [record, ...prev]);
    }, 2500);
  };

  // Detail view for a scan record
  if (selectedScan) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <PageHeader title="Scan Details" showBack />
        <div className="px-4 py-6 space-y-4">
          <button
            onClick={() => setSelectedScan(null)}
            className="flex items-center gap-1 text-sm text-primary font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to History
          </button>

          <div
            className={`rounded-xl p-4 ${
              selectedScan.result === "Healthy"
                ? "bg-accent"
                : "bg-destructive/10"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {selectedScan.result === "Healthy" ? (
                <ShieldCheck className="w-6 h-6 text-success" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-destructive" />
              )}
              <h3 className="font-semibold text-foreground">
                {selectedScan.result}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Plant: {selectedScan.plantName}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Scanned: {new Date(selectedScan.timestamp).toLocaleString()}
            </p>
          </div>

          {selectedScan.treatment && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-foreground">
                Treatment Recommendation
              </h4>
              {[
                {
                  icon: Leaf,
                  title: "Nutrient Recommendation",
                  desc: selectedScan.treatment.nutrient,
                },
                {
                  icon: Droplets,
                  title: "Watering Recommendation",
                  desc: selectedScan.treatment.watering,
                },
                {
                  icon: Bug,
                  title: "Pest Treatment",
                  desc: selectedScan.treatment.pesticide,
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl p-3 flex items-start gap-3 border border-border"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                    <s.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">
                      {s.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Pest Detect" showBack />

      <div className="px-4 py-6 flex flex-col items-center">
        {/* Hidden Camera Input */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          ref={cameraInputRef}
          onChange={onFileChange}
        />

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
              <p className="text-muted-foreground text-sm">
                Point at your plant
              </p>
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
              <h3 className="font-semibold text-accent-foreground">
                No Pests Detected!
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your plant looks healthy. Keep up the good work!
            </p>
          </div>
        )}

        {result === "infected" && (
          <div className="mt-6 w-full max-w-xs space-y-3 animate-slide-up">
            <div className="bg-destructive/10 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-destructive" />
                <h3 className="font-semibold text-destructive">
                  Pest Detected
                </h3>
              </div>
            </div>

            <h4 className="font-semibold text-sm text-foreground">
              Treatment Recommendation
            </h4>
            <div className="space-y-2">
              {[
                {
                  icon: Leaf,
                  title: "Nutrient Recommendation",
                  desc: defaultTreatment.nutrient,
                },
                {
                  icon: Droplets,
                  title: "Watering Recommendation",
                  desc: defaultTreatment.watering,
                },
                {
                  icon: Bug,
                  title: "Pest Treatment",
                  desc: defaultTreatment.pesticide,
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl p-3 flex items-start gap-3 border border-border"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                    <s.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">
                      {s.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detection History */}
        <div className="mt-8 w-full max-w-xs">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <History className="w-4 h-4 text-primary" /> Detection History
          </h3>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-card rounded-lg p-3 text-center border border-border">
              <p className="text-lg font-bold text-foreground">
                {scanHistory.length}
              </p>
              <p className="text-[10px] text-muted-foreground">Total Scans</p>
            </div>
            <div className="bg-card rounded-lg p-3 text-center border border-border">
              <p className="text-lg font-bold text-primary">{healthyCount}</p>
              <p className="text-[10px] text-muted-foreground">Healthy</p>
            </div>
            <div className="bg-card rounded-lg p-3 text-center border border-border">
              <p className="text-lg font-bold text-destructive">
                {diseasedCount}
              </p>
              <p className="text-[10px] text-muted-foreground">Diseased</p>
            </div>
          </div>

          {scanHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No scans yet. Start scanning!
            </p>
          ) : (
            <div className="space-y-2">
              {scanHistory.slice(0, 10).map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => setSelectedScan(scan)}
                  className="w-full bg-card rounded-lg p-3 border border-border flex items-center gap-3 text-left"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      scan.result === "Healthy"
                        ? "bg-primary-light"
                        : "bg-destructive/10"
                    }`}
                  >
                    {scan.result === "Healthy" ? (
                      <ShieldCheck className="w-4 h-4 text-primary" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {scan.plantName}
                    </p>
                    <p
                      className={`text-xs ${
                        scan.result === "Healthy"
                          ? "text-primary"
                          : "text-destructive"
                      }`}
                    >
                      {scan.result}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(scan.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PestDetectPage;
