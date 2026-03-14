import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Smile,
  Image as ImageIcon,
  Camera,
  MoreVertical,
  CheckCheck,
  X,
  Loader2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chatThreads, setChatThreads, currentUser } = useApp();
  const [messageInput, setMessageInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const thread = chatThreads.find((t) => t.id === id);
  const messages = thread?.messages || [];

  const emojis = [
    "😊",
    "🥦",
    "🥕",
    "🍅",
    "👍",
    "🥬",
    "🌽",
    "📦",
    "🚛",
    "💰",
    "🙏",
    "✅",
    "🍎",
    "🍐",
    "🍋",
    "🍓",
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, isUploading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [messageInput]);

  const handleSend = (text: string, type: "text" | "image" = "text") => {
    const content = text || messageInput;
    if (!content.trim()) return;

    const newMsg = {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      text: content,
      timestamp: new Date(),
      type,
    };

    setChatThreads(
      chatThreads.map((t) =>
        t.id === id ? { ...t, messages: [...t.messages, newMsg] } : t
      )
    );

    setMessageInput("");
    setShowEmojiPicker(false);

    // Mock automatic reply
    setTimeout(() => {
      const reply = {
        id: `r${Date.now()}`,
        senderId: "other",
        text:
          type === "image"
            ? "Wow, that looks fresh! How much per kg?"
            : "Got your message, I'll check and get back to you.",
        timestamp: new Date(),
        type: "text",
      };
      setChatThreads((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, messages: [...t.messages, reply] } : t
        )
      );
    }, 1500);
  };

  const onFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isCamera = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Simulate real file reading
    const reader = new FileReader();
    reader.onloadend = () => {
      setTimeout(() => {
        setIsUploading(false);
        handleSend(reader.result as string, "image");
        toast.success(isCamera ? "Photo sent!" : "Image sent!");
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const insertEmoji = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  if (!thread) return <div className="p-4">Chat not found</div>;

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto relative overflow-hidden">
      {/* Hidden Inputs */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => onFileChange(e)}
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={cameraInputRef}
        onChange={(e) => onFileChange(e, true)}
      />

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card border-b border-border shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(`/farmer/${id}`)}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl shadow-inner">
              👨‍🌾
            </div>
            <div>
              <h1 className="font-bold text-sm text-foreground leading-tight">
                {thread.participantName || "Farmer"}
              </h1>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 scrollbar-hide"
      >
        <div className="text-center py-4">
          <span className="px-3 py-1 bg-card border border-border rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Today
          </span>
        </div>

        {messages.map((msg: any) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex ${
                isMe ? "justify-end" : "justify-start"
              } animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[80%] flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl shadow-sm ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-card border border-border text-foreground rounded-tl-none"
                  }`}
                >
                  {msg.type === "image" ? (
                    <div className="space-y-2">
                      <img
                        src={msg.text}
                        alt="Shared"
                        className="rounded-xl w-full object-cover max-h-60 shadow-inner"
                      />
                      <p className="text-[10px] opacity-70">Image shared</p>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[9px] text-muted-foreground font-medium">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isMe && <CheckCheck className="w-3 h-3 text-primary" />}
                </div>
              </div>
            </div>
          );
        })}
        {isUploading && (
          <div className="flex justify-end animate-in fade-in duration-300">
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Sending Media...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-24 left-4 right-4 bg-card border border-border rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 z-20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Quick Emojis
            </span>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid grid-cols-8 gap-2">
            {emojis.map((e) => (
              <button
                key={e}
                onClick={() => insertEmoji(e)}
                className="text-2xl hover:scale-125 transition-transform p-1 active:scale-95"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border safe-bottom z-10">
        <div className="flex flex-col gap-3">
          {/* Quick Actions */}
          <div className="flex items-center gap-4 px-1">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                showEmojiPicker
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Smile className="w-4 h-4" /> Emoji
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              <ImageIcon className="w-4 h-4" /> Gallery
            </button>
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              <Camera className="w-4 h-4" /> Camera
            </button>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1 bg-muted/50 border border-border rounded-2xl p-1 flex items-end">
              <textarea
                ref={textareaRef}
                rows={1}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(messageInput);
                  }
                }}
                placeholder="Type your message here..."
                className="w-full bg-transparent border-none py-3 px-4 text-sm focus:outline-none focus:ring-0 resize-none max-h-[120px] scrollbar-hide"
              />
            </div>

            <button
              onClick={() => handleSend(messageInput)}
              disabled={!messageInput.trim() && !isUploading}
              className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none disabled:scale-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
