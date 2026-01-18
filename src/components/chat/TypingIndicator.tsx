import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-secondary rounded-2xl rounded-bl-md w-fit">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-muted-foreground"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default TypingIndicator;
