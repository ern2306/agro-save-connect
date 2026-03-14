import { useParams, useNavigate } from "react-router-dom";
import { Printer, ArrowLeft, Package, MapPin, Phone, User, Calendar } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { QRCodeSVG } from "qrcode.react";
import { useApp } from "@/context/AppContext";
import { format } from "date-fns";

const PrintLabelPage = () => {
  const { tracking } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const today = format(new Date(), "dd MMM yyyy");
  const qrValue = `https://agrosave.com/track/${tracking}`;

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Shipping Label" showBack />

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-label, #print-label * { visibility: visible; }
          #print-label { position: fixed; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="px-4 py-6 flex flex-col items-center">

        {/* Label preview */}
        <div
          id="print-label"
          className="w-full max-w-sm bg-white rounded-2xl border-2 border-border shadow-md overflow-hidden"
        >
          {/* Label header */}
          <div className="bg-primary px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-foreground" />
              <span className="text-primary-foreground font-bold text-sm tracking-wide">AgroSave</span>
            </div>
            <span className="text-primary-foreground/80 text-[10px] font-medium uppercase tracking-widest">Shipping Label</span>
          </div>

          {/* Tracking number bar */}
          <div className="bg-primary/10 px-5 py-3 border-b border-border">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Tracking Number</p>
            <p className="text-xl font-bold text-foreground tracking-widest">{tracking}</p>
          </div>

          {/* Main content: sender & QR */}
          <div className="px-5 py-4 flex gap-4">
            {/* Sender info */}
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">From (Sender)</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-foreground">
                    <User className="w-3 h-3 text-primary shrink-0" />
                    <span className="font-medium">{currentUser.username}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3 text-primary shrink-0" />
                    <span>{currentUser.phone}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                    <span className="leading-tight">{currentUser.address || "123 Farm Road, KL"}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">To (Recipient)</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-foreground">
                    <Package className="w-3 h-3 text-primary shrink-0" />
                    <span className="font-medium">Food Bank Malaysia</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                    <span className="leading-tight">12, Jalan Bangsar Utama, 59000 KL</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Calendar className="w-3 h-3 text-primary" />
                <span>Date: {today}</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="bg-white p-2 rounded-xl border border-border shadow-sm">
                <QRCodeSVG
                  value={qrValue}
                  size={100}
                  bgColor="#ffffff"
                  fgColor="#1a1a1a"
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-[9px] text-muted-foreground mt-1.5 text-center leading-tight">
                Scan to track<br />package
              </p>
            </div>
          </div>

          {/* Barcode-style visual */}
          <div className="px-5 py-3 border-t border-border bg-muted/20">
            <div className="flex items-end justify-center gap-[1.5px] h-10 mb-1">
              {(tracking || "").split("").map((char, i) => {
                const h = 20 + (char.charCodeAt(0) % 4) * 6;
                const w = (char.charCodeAt(0) % 2) + 1;
                return (
                  <div
                    key={i}
                    className="bg-foreground rounded-sm"
                    style={{ width: `${w * 2}px`, height: `${h}px` }}
                  />
                );
              })}
            </div>
            <p className="text-center text-[9px] text-muted-foreground tracking-widest font-mono">{tracking}</p>
          </div>

          {/* Footer */}
          <div className="bg-primary/5 px-5 py-2.5 border-t border-border">
            <p className="text-[9px] text-muted-foreground text-center">
              AgroSave Food Distribution Network · agrosave.com · Handle with care — Fresh Produce
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="w-full max-w-sm mt-6 space-y-3 no-print">
          <button onClick={handlePrint}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-sm">
            <Printer className="w-4 h-4" /> Print Shipping Label
          </button>
          <button onClick={() => navigate(-1)}
            className="w-full py-3 rounded-xl border border-border text-foreground font-medium text-sm flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>

        {/* QR code info */}
        <div className="w-full max-w-sm mt-4 bg-card rounded-xl p-4 border border-border no-print">
          <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-primary" /> QR Code Details
          </p>
          <p className="text-xs text-muted-foreground">
            The QR code on this label links to the live tracking page for your shipment. Scan it with any QR reader to view real-time delivery status.
          </p>
          <div className="mt-2 bg-muted/50 rounded-lg px-3 py-2">
            <p className="text-[10px] text-muted-foreground font-mono break-all">{qrValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintLabelPage;
