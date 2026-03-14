import { useState, useRef, useEffect } from "react";
import {
  Search,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Send,
  User,
  Bot,
  X,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppContext";

const HelpCenterPage = () => {
  const { t } = useApp();
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! I'm your AgroSave AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

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
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");

    // Simple AI Simulation
    setTimeout(() => {
      let botReply =
        "That's a great question! Let me check that for you. Is there anything specific about that you'd like to know?";
      if (
        userMsg.toLowerCase().includes("hello") ||
        userMsg.toLowerCase().includes("hi")
      ) {
        botReply = "Hi there! How can I assist you with AgroSave today?";
      } else if (userMsg.toLowerCase().includes("donate")) {
        botReply =
          "To donate, go to the Sell tab and select 'Donate Surplus'. It's a great way to reduce waste!";
      } else if (userMsg.toLowerCase().includes("pest")) {
        botReply =
          "Our Pest Detection tool uses AI to scan your plants. Just upload a photo in the Pest Detect tab.";
      }
      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    }, 1000);
  };

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
            Direct Support
          </h3>
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-full bg-primary/10 border border-primary/20 rounded-2xl p-5 flex items-center justify-between hover:bg-primary/15 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-foreground">
                  Live AI Chat
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Get instant answers from our AI assistant
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ChevronUp className="w-4 h-4 rotate-90" />
            </div>
          </button>
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Frequently Asked Questions
          </h3>
          <div className="space-y-2">
            {filteredFaqs.map((faq, idx) => (
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
            ))}
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[60] bg-background flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="p-4 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  AgroSave AI
                </h3>
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in zoom-in duration-300`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-card border border-border text-foreground rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-card border-t border-border flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-muted/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button
              type="submit"
              className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-transform"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HelpCenterPage;
