import { motion } from "framer-motion";
import { Sparkles, Heart, Users } from "lucide-react";

const MatchingAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full gap-6 relative overflow-hidden"
    >
      {/* Background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(135deg, ${
                ['#ec4899', '#a855f7', '#06b6d4', '#f97316'][Math.floor(Math.random() * 4)]
              }, transparent)`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main spinner */}
      <div className="relative">
        <motion.div
          className="w-28 h-28 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #ec4899, #a855f7, #06b6d4)',
            padding: '4px',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Users className="w-12 h-12 text-purple-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Orbiting hearts */}
        {[0, 120, 240].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              top: '50%',
              left: '50%',
              marginTop: '-16px',
              marginLeft: '-16px',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: (angle / 360) * 3,
            }}
          >
            <motion.div
              style={{
                translateX: 60,
              }}
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <Heart 
                className={`w-5 h-5 ${
                  i === 0 ? 'text-pink-500' : i === 1 ? 'text-purple-500' : 'text-cyan-500'
                }`}
                fill="currentColor"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <div className="flex items-center gap-2 text-xl font-semibold mb-2">
          <Sparkles className="h-5 w-5 text-pink-400" />
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Finding your match...
          </span>
          <Sparkles className="h-5 w-5 text-cyan-400" />
        </div>
        <p className="text-sm text-muted-foreground">
          Connecting you with someone special
        </p>
      </motion.div>

      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{
              background: ['#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#06b6d4'][i],
            }}
            animate={{ 
              scale: [1, 1.5, 1], 
              opacity: [0.5, 1, 0.5],
              y: [0, -8, 0]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MatchingAnimation;
