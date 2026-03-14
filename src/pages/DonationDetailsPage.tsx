import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotificationsPage from "./pages/NotificationsPage";
import DonationDetailsPage from "./pages/DonationDetailsPage";
import HomePage from "./pages/HomePage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import NewOrderPage from "./pages/NewOrderPage";
import RefundPage from "./pages/RefundPage";

function App() {
  return (
    <Router>
      <Routes>

        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Notifications */}
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* Donation Details */}
        <Route path="/donation-details/:id" element={<DonationDetailsPage />} />

        {/* Other pages */}
        <Route path="/order-details/:id" element={<OrderDetailsPage />} />
        <Route path="/new-order/:id" element={<NewOrderPage />} />
        <Route path="/refund/:id" element={<RefundPage />} />

      </Routes>
    </Router>
  );
}

export default App;
