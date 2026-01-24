import { motion } from "framer-motion";
import { UserX } from "lucide-react";

interface DisconnectNotificationProps {
  partnerName?: string;
}

const DisconnectNotification = ({ partnerName }: DisconnectNotificationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center gap-3 px-4 py-3 mx-4 my-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
        <UserX className="w-5 h-5 text-white" />
      </div>
      <p className="text-foreground font-medium">
        {partnerName ? `${partnerName} has left the chat` : "Stranger has left the chat"}
      </p>
    </motion.div>
  );
};

export default DisconnectNotification;
