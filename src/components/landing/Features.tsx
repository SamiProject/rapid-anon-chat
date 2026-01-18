import { motion } from "framer-motion";
import { MessageCircle, Shield, Zap, Users, Lock, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Connection",
    description: "Get matched with someone new in seconds. No waiting, no queues.",
  },
  {
    icon: Shield,
    title: "Complete Privacy",
    description: "Your identity stays hidden. Chat freely without revealing who you are.",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Chat",
    description: "Send and receive messages instantly with zero delay.",
  },
  {
    icon: Users,
    title: "Global Community",
    description: "Connect with people from all around the world, 24/7.",
  },
  {
    icon: Lock,
    title: "Safe Space",
    description: "Built-in moderation and report tools keep conversations respectful.",
  },
  {
    icon: Globe,
    title: "No Sign-Up",
    description: "Start chatting immediately. No email, no account required.",
  },
];

const Features = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-gradient">Anonymous Chat</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need for meaningful conversations with strangers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow/10"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-button transition-all duration-300">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
