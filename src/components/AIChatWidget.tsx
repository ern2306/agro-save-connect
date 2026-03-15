import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  X,
  MessageCircle,
  Loader2,
  Sparkles,
  HelpCircle,
  ShoppingBag,
  Bug,
} from "lucide-react";
import { useLocation } from "react-router-dom";

// Define types for messages
interface Message {
  text: string;
  role: "user" | "bot";
}

// Upgraded responses specific to AgroSave
const upgradedResponses: { [key: string]: string } = {
  pricing:
    "AgroSave is free to join! We only take a small 5% service fee on successful sales to keep the platform running. This fee helps us maintain the AI tools and secure payment systems.",
  support:
    "Our support team is available 24/7. You can email us at support@agrosave.com, call our hotline at +603-1234-5678, or use this chat for instant help with orders, listings, or technical issues.",
  refund:
    "Refunds can be requested within 24 hours of receiving your order if the quality isn't as described. Simply go to 'My Orders', select the order, and click 'Request Refund'. Our team will review it within 48 hours.",
  donate:
    "To donate surplus food, go to the 'Sell' tab and select 'Donate Surplus'. You can choose a local community organization, and we'll even help you generate a shipping label or arrange a pickup!",
  pest: "Our AI Pest Detection tool uses advanced computer vision to identify over 50 types of common crop pests and diseases. Just upload a clear photo in the 'Pest Detect' tab to get instant treatment recommendations.",
  hello:
    "Hi there! I'm your AgroSave AI assistant, powered by advanced agricultural data. How can I help you optimize your farming or find the best fresh produce today?",
  hi: "Hello! Welcome to the AgroSave community. I can help you with pest detection, managing your wallet, or finding nearby surplus food. What's on your mind?",
  thanks:
    "You're very welcome! I'm always here to help you grow better and save more. Happy farming!",
  "thank you":
    "It's my pleasure! Let me know if you have any other questions about AgroSave's features.",
  wallet:
    "Your AgroSave Wallet allows for instant, secure payments. You can top up via FPX or Credit Card, and withdrawals to your bank account typically take 1-2 business days.",
  security:
    "We take your security seriously. All transactions are encrypted, and we use secure OAuth for logins. You can manage your privacy settings and blocked users in the Settings menu.",
};

const AIChatWidget: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your upgraded AgroSave AI assistant. How can I help you today?",
      role: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check if widget should be shown based on settings and current page
  useEffect(() => {
    const isEnabled = localStorage.getItem("show_ai_chat") !== "false";
    const isLoginPage =
      location.pathname === "/login" || location.pathname === "/";
    setShowWidget(isEnabled && !isLoginPage);
  }, [location.pathname]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() === "" || isTyping) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { text: userMsg, role: "user" }]);
    setInput("");
    setIsTyping(true);

    // Logic for response
    setTimeout(() => {
      const lowerInput = userMsg.toLowerCase();
      let botReply =
        "That's an interesting point! As an AI specialized in agriculture and food systems, I recommend checking our Help Center for detailed guides, or I can explain more about our Pest Detection and Surplus Donation features. What would you like to know?";

      // Check for keyword-triggered responses
      for (const keyword in upgradedResponses) {
        if (lowerInput.includes(keyword)) {
          botReply = upgradedResponses[keyword];
          break;
        }
      }

      setMessages((prev) => [...prev, { text: botReply, role: "bot" }]);
      setIsTyping(false);
    }, 1000);
  };

  if (!showWidget) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[100] font-sans">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-all duration-300 group"
        >
          <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[320px] sm:w-[360px] h-[500px] bg-card border border-border rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          {/* Header */}
          <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm">AgroSave AI Pro</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-medium opacity-80 uppercase tracking-wider">
                    Online & Ready
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-muted/30 border-b border-border flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { icon: Bug, label: "Pest Help", key: "pest" },
              { icon: ShoppingBag, label: "Refunds", key: "refund" },
              { icon: HelpCircle, label: "Support", key: "support" },
            ].map((action) => (
              <button
                key={action.key}
                onClick={() => {
                  setInput(action.label);
                  handleSendMessage();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-full text-[10px] font-bold whitespace-nowrap hover:bg-primary/5 transition-colors"
              >
                <action.icon className="w-3 h-3 text-primary" />
                {action.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10 scrollbar-hide"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-card border border-border text-foreground rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-card border border-border p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">
                    AI is analyzing...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-card border-t border-border flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about farming, orders..."
              className="flex-1 bg-muted/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 disabled:opacity-50 disabled:scale-100 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatWidget;
