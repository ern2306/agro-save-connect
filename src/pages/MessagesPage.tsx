import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { formatDistanceToNow } from "date-fns";

const MessagesPage = () => {
  const { chatThreads } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Messages" showBack />
      <div className="px-4 py-3 space-y-2">
        {chatThreads.filter((t) => t.messages.length > 0).map((thread) => {
          const lastMsg = thread.messages[thread.messages.length - 1];
          return (
            <button
              key={thread.id}
              onClick={() => navigate(`/chat/${thread.id}`)}
              className="w-full bg-card rounded-xl p-3 flex items-center gap-3 border border-border text-left"
            >
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-2xl shrink-0">
                {thread.participantAvatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm text-foreground">{thread.participantName}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(lastMsg.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{lastMsg.text}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MessagesPage;
