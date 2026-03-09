import { ArrowLeft, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  showChat?: boolean;
  rightAction?: React.ReactNode;
}

const PageHeader = ({ title, showBack = false, showChat = false, rightAction }: PageHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-40 bg-primary px-4 py-3 flex items-center gap-3">
      {showBack && (
        <button onClick={() => navigate(-1)} className="text-primary-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <h1 className="text-primary-foreground font-semibold text-lg flex-1">{title}</h1>
      {showChat && (
        <button onClick={() => navigate("/messages")} className="text-primary-foreground">
          <MessageCircle className="w-5 h-5" />
        </button>
      )}
      {rightAction}
    </div>
  );
};

export default PageHeader;
