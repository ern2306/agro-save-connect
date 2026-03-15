import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, MoreVertical, Smile, Image, Camera, Gift, Check, CheckCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chatThreads, setChatThreads, currentUser } = useApp();
  const thread = chatThreads.find((t) => t.id === id);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const emojis = ["😀", "😂", "❤️", "👍", "🎉", "🔥", "😍", "🙌", "👏", "💯"];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages.length]);

  if (!thread) return <div className="p-4">Chat not found</div>;

  const handleSend = () => {
    if (!message.trim() && !selectedImage) return;

    const newMsg = {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      text: message || (selectedImage ? `[Image: ${selectedImage.name}]` : ""),
      timestamp: new Date(),
    };

    setChatThreads(
      chatThreads.map((t) =>
        t.id === id ? { ...t, messages: [...t.messages, newMsg] } : t
      )
    );

    setMessage("");
    setSelectedImage(null);
    setShowEmojiPicker(false);
    toast.success("Message sent!");
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(message + emoji);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-background rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h2 className="font-semibold text-foreground">{thread.participantName}</h2>
            <p className="text-xs text-green-500 font-medium">● ONLINE</p>
          </div>
        </div>
        <button className="p-2 hover:bg-background rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-4">
        {thread.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          thread.messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className="flex flex-col max-w-[75%]">
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 text-[10px] text-muted-foreground ${isMe ? "justify-end" : "justify-start"}`}>
                    <span>{formatTime(new Date(msg.timestamp))}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-primary" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="px-4 py-3 border-b border-border flex flex-wrap gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Selected Image Preview */}
        {selectedImage && (
          <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-muted/50">
            <span className="text-xs text-muted-foreground">📎 {selectedImage.name}</span>
            <button
              onClick={() => setSelectedImage(null)}
              className="text-xs text-primary hover:underline"
            >
              Remove
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="px-4 py-3 pb-[env(safe-area-inset-bottom,12px)]">
          <div className="flex items-center gap-2">
            {/* Emoji Button */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 hover:bg-background rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Image Button */}
            <button
              onClick={() => imageInputRef.current?.click()}
              className="p-2 hover:bg-background rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <Image className="w-5 h-5" />
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Camera Button */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="p-2 hover:bg-background rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Gift Button */}
            <button className="p-2 hover:bg-background rounded-full transition-colors text-muted-foreground hover:text-foreground">
              <Gift className="w-5 h-5" />
            </button>

            {/* Message Input */}
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type message..."
              className="flex-1 px-4 py-2.5 rounded-full bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!message.trim() && !selectedImage}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
