import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, Zap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";

const Hero = () => {
  const { onlineCount } = useOnlineUsers();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Colorful background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-background to-cyan-500/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-purple-500/30 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {onlineCount > 0 ? onlineCount.toLocaleString() : '0'} people online now
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Connect with{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Strangers
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Anonymously
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Start chatting instantly — no sign-up, no personal info. 
            Just open the app and connect with random people from around the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/chat">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="xl" 
                  className="group bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl px-10"
                >
                  <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin" />
                  Start Chatting Now
                </Button>
              </motion.div>
            </Link>
            <Button variant="outline" size="xl" className="border-purple-500/50 hover:bg-purple-500/20">
              Learn More
            </Button>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {[
              { icon: Zap, text: "Instant Connection", color: "from-yellow-500 to-orange-500" },
              { icon: Shield, text: "100% Anonymous", color: "from-cyan-500 to-blue-500" },
              { icon: MessageCircle, text: "Free Forever", color: "from-pink-500 to-purple-500" },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-purple-500/30"
              >
                <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                  <item.icon className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
