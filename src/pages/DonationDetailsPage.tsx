import { useParams, useLocation } from "react-router-dom";

const DonationDetailsPage = () => {
  const { id } = useParams();
  const { state } = useLocation();

  const {
    crop,
    kg,
    org,
    method,
    tracking,
    address,
    date,
    status
  } = state || {};

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">

        <h1 className="text-xl font-bold text-foreground">
          Donation Details
        </h1>

        <div className="space-y-2 text-sm">
          <p><strong>Donation ID:</strong> {id}</p>
          <p><strong>Crop:</strong> {crop}</p>
          <p><strong>Amount Donated:</strong> {kg} kg</p>
          <p><strong>Organization:</strong> {org}</p>
          <p><strong>Delivery Method:</strong> {method}</p>

          {tracking && (
            <p><strong>Tracking Number:</strong> {tracking}</p>
          )}

          {address && (
            <p><strong>Drop-off Address:</strong> {address}</p>
          )}

          <p><strong>Status:</strong> {status}</p>
          <p><strong>Date:</strong> {date}</p>
        </div>

      </div>
    </div>
  );
};

export default DonationDetailsPage;
