import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppContext";

const HelpCenterPage = () => {
  const { t } = useApp();
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do I donate my surplus food?",
      a: "Go to the 'Sell' tab and choose 'Donate Surplus'. Select the item you wish to donate, specify the quantity, and choose a recipient organization. You can then choose to drop off or have it picked up.",
    },
    {
      q: "Is my payment information secure?",
      a: "Yes, AgroSave uses industry-standard encryption to protect your data. We do not store your full credit card details on our servers.",
    },
    {
      q: "What is the Pest Detection feature?",
      a: "It's an AI-powered tool that helps you identify pests or diseases in your plants. Simply take a photo of your plant, and our system will analyze it and suggest treatments.",
    },
    {
      q: "How can I contact a seller?",
      a: "You can use the 'Messages' feature to chat directly with sellers. Simply click on a listing and select 'Chat with Seller'.",
    },
    {
      q: "How do I top up my wallet?",
      a: "Navigate to the 'Me' tab, select 'Wallet', and click on 'Top Up'. You will need to select your bank, enter your account number, and specify the amount you wish to add.",
    },
    {
      q: "What happens if a seller cancels my order?",
      a: "If a seller cancels your order, the full amount will be automatically refunded to your AgroSave wallet. You will receive a notification once the refund is processed.",
    },
    {
      q: "How do I track my order?",
      a: "Once a seller prepares your order and generates a tracking number, you can view it in the 'Order Details' page accessible from your notifications or order history.",
    },
    {
      q: "Can I edit my listing after posting?",
      a: "Yes, go to the 'Me' tab, select 'My Listings', and click the 'Edit' button on the listing you wish to modify.",
    },
    {
      q: "What are 'Rescue Crops'?",
      a: "Rescue Crops are surplus harvests that farmers offer at a discounted price to reduce food waste. Buying these helps support sustainable farming and reduces environmental impact.",
    },
    {
      q: "How do I change my app language?",
      a: "Go to the 'Me' tab. Under the profile section, you will find language options for English, Chinese, and Malay. Simply tap on your preferred language.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-10">
      <PageHeader title={t("help_center")} showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for help..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>

        {/* Support Options */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Contact Support
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-muted/30 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-foreground">
                Email Us
              </span>
            </button>
            <button className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-muted/30 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-foreground">Call Us</span>
            </button>
          </div>
          <button className="w-full bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 hover:bg-primary/15 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-foreground">
                Submit a Ticket
              </span>
              <span className="text-[10px] text-muted-foreground">
                Our team will respond within 24 hours
              </span>
            </div>
          </button>
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Frequently Asked Questions
          </h3>
          <div className="space-y-2">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-sm font-semibold text-foreground pr-4">
                      {faq.q}
                    </span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-primary" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 duration-300">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-muted-foreground py-10">
                No results found for "{search}"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
