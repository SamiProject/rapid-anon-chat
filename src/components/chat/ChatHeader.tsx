import { motion } from "framer-motion";
import { Flag, X, MoreVertical, Shield, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  isConnected: boolean;
  partnerName?: string;
  partnerLocation?: string;
  onDisconnect: () => void;
  onReport: () => void;
}

const ChatHeader = ({ isConnected, partnerName, partnerLocation, onDisconnect, onReport }: ChatHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-card via-card to-purple-900/20 border-b border-border"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <span className="text-xl">👤</span>
          </div>
          {isConnected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-card"
            />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {partnerName || "Stranger"}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {partnerLocation && (
              <>
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>{partnerLocation}</span>
                <span className="mx-1">•</span>
              </>
            )}
            <span className={isConnected ? "text-green-400" : "text-orange-400"}>
              {isConnected ? "Online" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-purple-500/20">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem
              onClick={onReport}
              className="text-orange-400 cursor-pointer hover:bg-orange-500/20"
            >
              <Flag className="h-4 w-4 mr-2" />
              Report User
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Shield className="h-4 w-4 mr-2" />
              Safety Tips
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onDisconnect}
          className="h-9 w-9 text-red-400 hover:bg-red-500/20 hover:text-red-300"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default ChatHeader;
