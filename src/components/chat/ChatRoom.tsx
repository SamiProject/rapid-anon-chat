import { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import MatchingAnimation from "./MatchingAnimation";
import UserProfileForm, { UserProfile } from "./UserProfileForm";
import DisconnectNotification from "./DisconnectNotification";
import ReportDialog from "./ReportDialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useChat } from "@/hooks/useChat";

const ChatRoom = () => {
  const {
    status,
    messages,
    isPartnerTyping,
    partnerInfo,
    partnerLeft,
    initiateChat,
    startMatching,
    sendMessage,
    setTyping,
    disconnect,
    findNew,
    reportUser
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPartnerTyping]);

  useEffect(() => {
    if (status === 'connected' && partnerInfo) {
      toast.success(`You're now connected with ${partnerInfo.name} from ${partnerInfo.location}!`);
    }
  }, [status, partnerInfo]);

  useEffect(() => {
    if (partnerLeft) {
      toast.info("Your partner has left the chat.");
    }
  }, [partnerLeft]);

  const handleStartChat = () => {
    initiateChat();
  };

  const handleProfileSubmit = (profile: UserProfile) => {
    startMatching(profile);
  };

  const handleSendMessage = async (text: string) => {
    await sendMessage(text);
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

  const handleReportClick = () => {
    setShowReportDialog(true);
  };

  const handleReportSubmit = async (reason: string) => {
    setShowReportDialog(false);
    await reportUser(reason);
    toast.success("Report submitted. Thank you for helping keep our community safe.");
  };

  const handleNewChat = () => {
    findNew();
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-purple-900/10 rounded-2xl border border-border overflow-hidden shadow-card">
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
              className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg"
              animate={{ 
                scale: [1, 1.08, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Ready to Connect?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Meet real people from around the world. Anonymous & instant.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="xl" 
                onClick={handleStartChat}
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl px-10"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Chat
              </Button>
            </motion.div>
          </motion.div>
        )}

        {status === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full overflow-y-auto"
          >
            <UserProfileForm onSubmit={handleProfileSubmit} />
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
              partnerName={partnerInfo?.name}
              partnerLocation={partnerInfo?.location}
              onDisconnect={handleDisconnect}
              onReport={handleReportClick}
            />
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {partnerLeft && <DisconnectNotification partnerName={partnerInfo?.name} />}
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
                  size="lg"
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-semibold"
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

      <ReportDialog
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default ChatRoom;
