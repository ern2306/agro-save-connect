import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  MapPin,
  Truck,
  Package,
  Calendar,
  User,
  ArrowLeft,
  Printer,
  CheckCircle2,
  Building2,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { format } from "date-fns";

const DonationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const donationData = location.state;

  if (!donationData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-bold text-foreground">Donation Not Found</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-6">
          We couldn't find the details for this donation.
        </p>
        <button
          onClick={() => navigate("/notifications")}
          className="w-full max-w-xs py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
        >
          Back to Notifications
        </button>
      </div>
    );
  }

  const { crop, kg, org, method, tracking, timestamp, address } = donationData;

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Donation Details" showBack />

      <div className="px-4 py-4 space-y-4">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 rounded-2xl p-6 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-bold text-foreground text-lg">
            Donation Successful
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Thank you for donating{" "}
            <span className="font-bold text-foreground">{kg} kg</span> of {crop}
          </p>
        </div>

        {/* Donation Info Card */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm space-y-4">
          <div className="flex items-start justify-between border-b border-border pb-4">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Recipient
              </p>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground">{org}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Date
              </p>
              <div className="flex items-center gap-1 justify-end">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-foreground">
                  {format(new Date(timestamp), "dd MMM yyyy")}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Delivery Method
              </p>
              <div className="flex items-center gap-2">
                {method === "pickup" ? (
                  <Truck className="w-4 h-4 text-primary" />
                ) : (
                  <Package className="w-4 h-4 text-primary" />
                )}
                <span className="text-sm font-medium text-foreground capitalize">
                  {method}
                </span>
              </div>
            </div>
            {tracking && (
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Tracking No.
                </p>
                <span className="text-sm font-mono font-bold text-primary">
                  {tracking}
                </span>
              </div>
            )}
          </div>

          {address && (
            <div className="pt-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                {method === "pickup" ? "Pick-up Address" : "Drop-off Address"}
              </p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-tight">
                  {address}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {method === "pickup" && tracking && (
            <button
              onClick={() => navigate(`/print-label/${tracking}`)}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print Shipping Label
            </button>
          )}

          <button
            onClick={() => navigate("/notifications")}
            className="w-full py-3 rounded-xl border border-border text-foreground font-medium text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationDetailsPage;
