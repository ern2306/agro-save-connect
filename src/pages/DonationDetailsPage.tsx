import { useParams } from "react-router-dom";

const DonationDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Donation Details</h1>
      <p>Donation ID: {id}</p>
    </div>
  );
};

export default DonationDetailsPage;
