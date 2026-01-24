import { motion } from "framer-motion";
import { ArrowLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
import ChatRoom from "@/components/chat/ChatRoom";
import { Button } from "@/components/ui/button";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { useEffect } from "react";

const Chat = () => {
  const { onlineCount, refreshCount } = useOnlineUsers();

  // Refresh count on mount
  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-900/20 flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-purple-500/20">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <motion.div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-purple-500/30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Users className="h-4 w-4 text-purple-400" />
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {onlineCount.toLocaleString()} online
            </span>
          </motion.div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-[calc(100vh-140px)]"
        >
          <ChatRoom />
        </motion.div>
      </main>
    </div>
  );
};

export default Chat;
