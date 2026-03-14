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
  Gift,
} from "lucide-react";
import { useApp, ChatMessage } from "@/context/AppContext";
import { toast } from "sonner";

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chatThreads, setChatThreads, currentUser } = useApp();

  const [messageInput, setMessageInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showStickerPanel, setShowStickerPanel] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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
  const stickers = ["🥦", "🥕", "🌽", "🥬", "🍅", "📦", "✅", "💰"];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, isUploading]);

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

    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      text: content,
      timestamp: new Date(),
      type,
    };

    setChatThreads((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, messages: [...t.messages, newMsg] } : t
      )
    );

    setMessageInput("");
    setShowEmojiPicker(false);
    setShowStickerPanel(false);

    // Mock automatic reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const reply: ChatMessage = {
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
    }, 500);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const sendSelectedImage = () => {
    if (!selectedImage) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      handleSend(selectedImage, "image");
      setSelectedImage(null);
      toast.success("Image sent!");
    }, 1200);
  };

  const insertEmoji = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  if (!thread)
    return (
      <div className="p-4 text-center mt-20 font-bold text-muted-foreground">
        Chat thread not found
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto relative overflow-hidden">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={onFileChange}
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={cameraInputRef}
        onChange={onFileChange}
      />

      {/* HEADER */}
      <div className="flex items-center justify-between p-4 bg-card border-b border-border shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex flex-col">
            <div className="font-bold text-sm text-foreground">
              {thread.participantName || "Farmer"}
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                Online
              </span>
            </div>
          </div>
        </div>
        <MoreVertical className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* MESSAGES - added pb-32 to make room for fixed input */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 pb-40 space-y-4 bg-muted/20 scrollbar-hide"
      >
        {messages.map((msg: ChatMessage) => {
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
                    <img
                      src={msg.text}
                      alt="Shared"
                      className="rounded-xl w-full object-cover max-h-60 shadow-inner"
                    />
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

        {isTyping && (
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Farmer is typing...
          </div>
        )}

        {isUploading && (
          <div className="flex justify-end animate-in fade-in duration-300">
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Sending...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* FIXED INPUT AREA AT BOTTOM */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border z-30">
        {/* STICKER PANEL (Inside fixed area) */}
        {showStickerPanel && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-card border border-border rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Select Sticker
              </span>
              <button
                onClick={() => setShowStickerPanel(false)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {stickers.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s, "image")}
                  className="text-4xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center p-2 bg-muted/50 rounded-xl"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* EMOJI PICKER (Inside fixed area) */}
        {showEmojiPicker && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-card border border-border rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
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

        <div className="flex items-center gap-4 mb-3 px-1">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`transition-colors ${
              showEmojiPicker
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Smile className="w-5 h-5" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowStickerPanel(!showStickerPanel)}
            className={`transition-colors ${
              showStickerPanel
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Gift className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-end gap-2 bg-muted/40 border border-border rounded-2xl px-3 py-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(messageInput);
              }
            }}
            placeholder="Type message..."
            className="flex-1 bg-transparent outline-none resize-none text-sm max-h-[120px] py-1"
          />
          <button
            onClick={() => handleSend(messageInput)}
            disabled={!messageInput.trim()}
            className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-transform disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* IMAGE PREVIEW (Full screen) */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl border border-border/50 animate-in zoom-in-95 duration-300">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Preview Image
            </h3>
            <img
              src={selectedImage}
              className="rounded-2xl max-h-80 w-full object-cover mb-6 shadow-lg border border-border"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedImage(null)}
                className="flex-1 bg-muted text-foreground font-bold py-4 rounded-2xl active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={sendSelectedImage}
                className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-transform"
              >
                Send Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
