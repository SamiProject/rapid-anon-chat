import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isOwn: boolean;
  timestamp?: string;
}

const ChatMessage = ({ message, isOwn, timestamp }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex w-full",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
          isOwn
            ? "bg-gradient-primary text-primary-foreground rounded-br-md"
            : "bg-secondary text-secondary-foreground rounded-bl-md"
        )}
      >
        <p className="leading-relaxed">{message}</p>
        {timestamp && (
          <span className={cn(
            "text-xs mt-1 block opacity-70",
            isOwn ? "text-right" : "text-left"
          )}>
            {timestamp}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
