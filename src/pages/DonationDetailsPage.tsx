import { useParams, useLocation, useNavigate } from "react-router-dom";

const DonationDetailsPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Donation Details</h1>
        <p>No donation data found.</p>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { crop, kg, org, method, tracking, address, date, status } = state;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="bg-card rounded-xl border border-border p-6 space-y-3">

        <h1 className="text-xl font-bold">Donation Details</h1>

        <p><strong>Donation ID:</strong> {id}</p>
        <p><strong>Crop Donated:</strong> {crop}</p>
        <p><strong>Amount:</strong> {kg} kg</p>
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

        <button
          onClick={() => navigate("/my-listings")}
          className="mt-4 w-full py-3 rounded-xl bg-primary text-primary-foreground"
        >
          Back to My Listings
        </button>

      </div>
    </div>
  );
};

export default DonationDetailsPage;

export default DonationDetailsPage;
