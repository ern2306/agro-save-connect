
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageCircle, Loader2 } from 'lucide-react';

// Define types for messages
interface Message {
  text: string;
  role: 'user' | 'bot';
}

// Keyword-based responses specific to AgroSave
const keywordResponses: { [key: string]: string } = {
  "pricing": "AgroSave is free to join! We only take a small 5% service fee on successful sales to keep the platform running.",
  "support": "Our support team is here for you. You can email us at support@agrosave.com or use this chat for instant help.",
  "refund": "Refunds can be requested within 24 hours of receiving your order if the quality isn't as described. Go to 'My Orders' to start a request.",
  "donate": "To donate surplus food, go to the 'Sell' tab and select 'Donate Surplus'. It's a great way to help the community!",
  "pest": "Our AI Pest Detection tool can identify issues from a photo. Just head to the 'Pest Detect' tab to try it out.",
  "hello": "Hi there! I'm your AgroSave AI assistant. How can I help you with your farming or food saving today?",
  "hi": "Hello! Welcome to AgroSave. What can I assist you with?",
  "thanks": "You're very welcome! Happy farming and food saving!",
  "thank you": "Glad I could help! Let me know if you need anything else.",
};

const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your AgroSave AI assistant. How can I help you today?", role: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() === '' || isTyping) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { text: userMsg, role: 'user' }]);
    setInput('');
    setIsTyping(true);

    // Logic for response
    setTimeout(() => {
      const lowerInput = userMsg.toLowerCase();
      let botReply = "That's a great question! I'm still learning about all the features of AgroSave, but I can help with donations, pest detection, and general app usage. Could you tell me more?";

      // 1. Check for keyword-triggered responses
      for (const keyword in keywordResponses) {
        if (lowerInput.includes(keyword)) {
          botReply = keywordResponses[keyword];
          break;
        }
      }

      setMessages((prev) => [...prev, { text: botReply, role: 'bot' }]);
      setIsTyping(false);
    }, 1200);
  };

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
        <div className="w-[320px] sm:w-[360px] h-[500px] bg-card border border-border rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          {/* Header */}
          <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm">AgroSave AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-medium opacity-80 uppercase tracking-wider">Online</span>
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

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 scrollbar-hide"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-card border border-border text-foreground rounded-tl-none'
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
                  <span className="text-xs text-muted-foreground font-medium">AI is thinking...</span>
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
              placeholder="Ask me anything..."
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