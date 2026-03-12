import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
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
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <div className="max-w-md mx-auto min-h-screen bg-background relative">
            <Routes>
              <Route path="/" element={<SplashPage />} />
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
              <Route path="/community-map" element={<CommunityMapPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
