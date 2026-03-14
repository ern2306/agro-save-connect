import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Send } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";

const ChatPage = () => {
  const { id } = useParams();
  const { chatThreads, setChatThreads, currentUser } = useApp();
  const thread = chatThreads.find((t) => t.id === id);
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages.length]);

  if (!thread) return <div className="p-4">Chat not found</div>;

  const handleSend = () => {
    if (!message.trim()) return;

    const newMsg = {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      text: message,
      timestamp: new Date(),
    };

    setChatThreads(
      chatThreads.map((t) =>
        t.id === id ? { ...t, messages: [...t.messages, newMsg] } : t
      )
    );

    setMessage("");
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col">

      <PageHeader title={thread.participantName} showBack />

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 pb-32">
        {thread.messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Chat Input */}
      <div className="sticky bottom-0 z-40 p-3 border-t border-border bg-card pb-[env(safe-area-inset-bottom,12px)]">
        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-full bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatPage;
