import { useNavigate } from "react-router-dom";
import { MessageSquare, Search, ChevronRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { format } from "date-fns";

const MessagesPage = () => {
  const { chatThreads } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Messages" />

      <div className="px-4 py-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="space-y-1">
          {chatThreads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs mt-1">
                When you chat with sellers or buyers, they will appear here.
              </p>
            </div>
          ) : (
            chatThreads.map((thread) => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              return (
                <button
                  key={thread.id}
                  onClick={() => navigate(`/chat/${thread.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors active:scale-[0.98]"
                >
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-2xl">
                      {thread.participantAvatar}
                    </div>
                    <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className="font-semibold text-foreground truncate">
                        {thread.participantName}
                      </h3>
                      {lastMsg && (
                        <span className="text-[10px] text-muted-foreground">
                          {format(lastMsg.timestamp, "HH:mm")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate pr-4">
                      {lastMsg ? lastMsg.text : "No messages yet"}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
