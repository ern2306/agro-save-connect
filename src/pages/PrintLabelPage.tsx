import { useParams } from "react-router-dom";
import { Printer } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const PrintLabelPage = () => {
  const { tracking } = useParams();

  const handlePrint = () => {
    window.print();
  };

  // Generate a simple barcode-like visual from the tracking number
  const barcodeLines = (tracking || "").split("").map((char, i) => {
    const width = (char.charCodeAt(0) % 3) + 1;
    return { key: i, width };
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Print Label" showBack />
      <div className="px-4 py-6 flex flex-col items-center">
        {/* Label preview */}
        <div className="w-full max-w-xs bg-card rounded-2xl border-2 border-dashed border-border p-6 space-y-4 print:border-solid print:border-foreground">
          {/* Header */}
          <div className="text-center border-b border-border pb-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">AgroSave Shipping Label</p>
          </div>

          {/* Tracking Number */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Tracking Number</p>
            <p className="text-xl font-bold text-foreground tracking-wide">{tracking}</p>
          </div>

          {/* Barcode visualization */}
          <div className="flex items-end justify-center gap-[1px] h-16 py-2">
            {barcodeLines.map((line) => (
              <div
                key={line.key}
                className="bg-foreground"
                style={{
                  width: `${line.width * 2}px`,
                  height: `${40 + (line.key % 5) * 4}px`,
                }}
              />
            ))}
          </div>

          {/* Package info */}
          <div className="text-center border-t border-border pt-3">
            <p className="text-[10px] text-muted-foreground">Scan barcode for package details</p>
            <p className="text-[10px] text-muted-foreground mt-1">AgroSave Food Distribution Network</p>
          </div>
        </div>

        {/* Print button */}
        <button onClick={handlePrint}
          className="mt-6 w-full max-w-xs py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
          <Printer className="w-4 h-4" /> Print Label
        </button>
      </div>
    </div>
  );
};

export default PrintLabelPage;
