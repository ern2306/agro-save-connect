import type { FreshnessLevel } from "@/context/AppContext";

const freshnessLabels: Record<FreshnessLevel, { label: string; color: string; action: string }> = {
  5: { label: "Very Fresh", color: "text-primary", action: "Safe for normal storage." },
  4: { label: "Fresh", color: "text-primary", action: "Best consumed within 2–3 days." },
  3: { label: "Moderate", color: "text-yellow-600", action: "Should be picked up soon." },
  2: { label: "Urgent", color: "text-orange-500", action: "Distribute within 24 hours." },
  1: { label: "Critical", color: "text-destructive", action: "Must be rescued immediately." },
};

const FreshnessIndicator = ({ level, compact = false }: { level: FreshnessLevel; compact?: boolean }) => {
  const info = freshnessLabels[level];
  const stars = "⭐".repeat(level);

  if (compact) {
    return (
      <span className={`text-[10px] font-medium ${info.color}`}>
        {stars} {info.label}
      </span>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-sm">{stars}</span>
        <span className={`text-sm font-semibold ${info.color}`}>{info.label}</span>
      </div>
      <p className="text-xs text-muted-foreground">{info.action}</p>
    </div>
  );
};

export default FreshnessIndicator;
