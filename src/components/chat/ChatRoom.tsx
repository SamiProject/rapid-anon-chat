import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import MatchingAnimation from "./MatchingAnimation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

type ChatState = "idle" | "matching" | "connected" | "disconnected";

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: string;
}

const ChatRoom = () => {
  const [chatState, setChatState] = useState<ChatState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleStartChat = () => {
    setChatState("matching");
    setMessages([]);
    
    // Simulate matching delay
    setTimeout(() => {
      setChatState("connected");
      toast.success("You're now connected with a stranger!");
      
      // Simulate welcome message from stranger
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages([{
            id: "1",
            text: "Hey! 👋 Nice to meet you!",
            isOwn: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }, 1500);
      }, 1000);
    }, 2500);
  };

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isOwn: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMessage]);

    // Simulate response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          "That's interesting! Tell me more.",
          "Haha, I feel you! 😄",
          "No way! That's so cool.",
          "I totally agree with that.",
          "Interesting perspective! What else?",
        ];
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          isOwn: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000 + Math.random() * 2000);
    }, 500);
  };

  const handleDisconnect = () => {
    setChatState("disconnected");
    toast.info("You've disconnected from the chat.");
  };

  const handleReport = () => {
    toast.success("Report submitted. Thank you for helping keep our community safe.");
  };

  const handleNewChat = () => {
    handleStartChat();
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-2xl border border-border overflow-hidden shadow-card">
      <AnimatePresence mode="wait">
        {chatState === "idle" && (
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
              Start a conversation with a random stranger. No sign-up, completely anonymous.
            </p>
            <Button variant="hero" size="xl" onClick={handleStartChat}>
              Start Chat
            </Button>
          </motion.div>
        )}

        {chatState === "matching" && (
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

        {(chatState === "connected" || chatState === "disconnected") && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
          >
            <ChatHeader
              isConnected={chatState === "connected"}
              onDisconnect={handleDisconnect}
              onReport={handleReport}
            />
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg.text}
                  isOwn={msg.isOwn}
                  timestamp={msg.timestamp}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {chatState === "connected" ? (
              <ChatInput onSend={handleSendMessage} />
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
