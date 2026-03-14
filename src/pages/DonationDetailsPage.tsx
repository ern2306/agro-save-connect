import { useParams, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { formatDistanceToNow } from "date-fns";

const DonationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifications } = useApp();

  const donation = notifications.find(
    (n) => n.id === id && n.type === "donation"
  );

  if (!donation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Donation not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Donation Details" />

      <div className="px-4 py-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>

            <div>
              <h2 className="font-semibold text-lg text-foreground">
                {donation.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(donation.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-sm text-foreground leading-relaxed">
              {donation.message}
            </p>
          </div>

        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 flex items-center gap-2 text-sm text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Notifications
        </button>
      </div>
    </div>
  );
};

export default DonationDetailsPage;
