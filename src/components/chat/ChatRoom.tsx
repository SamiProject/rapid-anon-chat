import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import MatchingAnimation from "./MatchingAnimation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useChat } from "@/hooks/useChat";

const ChatRoom = () => {
  const {
    status,
    messages,
    isPartnerTyping,
    startMatching,
    sendMessage,
    setTyping,
    disconnect,
    findNew,
    reportUser
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPartnerTyping]);

  useEffect(() => {
    if (status === 'connected') {
      toast.success("You're now connected with a stranger!");
    }
  }, [status]);

  const handleStartChat = () => {
    startMatching();
  };

  const handleSendMessage = async (text: string) => {
    await sendMessage(text);
    // Clear typing indicator when sending
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    await setTyping(false);
  };

  const handleTyping = useCallback(() => {
    setTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 2000);
  }, [setTyping]);

  const handleDisconnect = async () => {
    await disconnect();
    toast.info("You've disconnected from the chat.");
  };

  const handleReport = async () => {
    await reportUser("User reported");
    toast.success("Report submitted. Thank you for helping keep our community safe.");
  };

  const handleNewChat = () => {
    findNew();
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-2xl border border-border overflow-hidden shadow-card">
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center h-full p-8 text-center"
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mb-6 shadow-glow"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-4xl">💬</span>
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Ready to Connect?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Start a conversation with a real person. No sign-up, completely anonymous.
            </p>
            <Button variant="hero" size="xl" onClick={handleStartChat}>
              Start Chat
            </Button>
          </motion.div>
        )}

        {status === "matching" && (
          <motion.div
            key="matching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <MatchingAnimation />
          </motion.div>
        )}

        {(status === "connected" || status === "disconnected") && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
          >
            <ChatHeader
              isConnected={status === "connected"}
              onDisconnect={handleDisconnect}
              onReport={handleReport}
            />
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg.content}
                  isOwn={msg.isOwn}
                  timestamp={msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
              ))}
              {isPartnerTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {status === "connected" ? (
              <ChatInput onSend={handleSendMessage} onTyping={handleTyping} />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t border-border"
              >
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleNewChat}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Find New Stranger
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatRoom;
