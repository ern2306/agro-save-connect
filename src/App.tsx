import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/context/AppContext";
import BottomNav from "@/components/BottomNav";
import SplashPage from "@/pages/SplashPage";
import ExplorePage from "@/pages/ExplorePage";
import PestDetectPage from "@/pages/PestDetectPage";
import AddListingPage from "@/pages/AddListingPage";
import NotificationsPage from "@/pages/NotificationsPage";
import MePage from "@/pages/MePage";
import OrderPage from "@/pages/OrderPage";
import OrderDetailsPage from "@/pages/OrderDetailsPage";
import NewOrderPage from "@/pages/NewOrderPage";
import RefundPage from "@/pages/RefundPage";
import ProfilePage from "@/pages/ProfilePage";
import WalletPage from "@/pages/WalletPage";
import MyListingsPage from "@/pages/MyListingsPage";
import EditListingPage from "@/pages/EditListingPage";
import MessagesPage from "@/pages/MessagesPage";
import ChatPage from "@/pages/ChatPage";
import DonateSurplusPage from "@/pages/DonateSurplusPage";
import CommunityMapPage from "@/pages/CommunityMapPage";
import PrintLabelPage from "@/pages/PrintLabelPage";
import DonationDetailsPage from "@/pages/DonationDetailsPage";
import LoginPage from "@/pages/LoginPage";
import SettingsPage from "@/pages/SettingsPage";
import HelpCenterPage from "@/pages/HelpCenterPage";
import AboutUsPage from "@/pages/AboutUsPage";
import FarmerProfilePage from "@/pages/FarmerProfilePage";
import NotFound from "@/pages/NotFound";
import AIChatWidget from "@/components/AIChatWidget";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const { currentUser } = useApp();

  // Pages where BottomNav should be HIDDEN
  const hideNavPaths = ["/", "/login"];

  // Simple auth guard
  const isAuthPage = hideNavPaths.includes(location.pathname);
  if (!currentUser && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  // Check if current path is a chat or farmer profile or donation detail
  const isChatPage = location.pathname.startsWith("/chat/");
  const isFarmerPage = location.pathname.startsWith("/farmer/");
  const isDonatePage = location.pathname.startsWith("/donate-surplus/");
  const isPrintPage = location.pathname.startsWith("/print-label/");
  const isDonationDetails = location.pathname.startsWith("/donation-details/");

  const shouldShowNav =
    !hideNavPaths.includes(location.pathname) &&
    !isChatPage &&
    !isFarmerPage &&
    !isDonatePage &&
    !isPrintPage &&
    !isDonationDetails;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background relative shadow-2xl border-x border-border/50">
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/pest-detect" element={<PestDetectPage />} />
        <Route path="/add-listing" element={<AddListingPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/me" element={<MePage />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/order-details/:id" element={<OrderDetailsPage />} />
        <Route path="/new-order/:id" element={<NewOrderPage />} />
        <Route path="/refund/:id" element={<RefundPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/my-listings" element={<MyListingsPage />} />
        <Route path="/edit-listing/:id" element={<EditListingPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/donate-surplus/:id" element={<DonateSurplusPage />} />
        <Route path="/donation-details/:id" element={<DonationDetailsPage />} />
        <Route path="/community-map" element={<CommunityMapPage />} />
        <Route path="/print-label/:tracking" element={<PrintLabelPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/farmer/:id" element={<FarmerProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {shouldShowNav && <BottomNav />}
      <AIChatWidget />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-center" />
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
