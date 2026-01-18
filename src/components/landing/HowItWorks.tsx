import { motion } from "framer-motion";
import { MousePointer, Search, MessageSquare, Heart } from "lucide-react";

const steps = [
  {
    icon: MousePointer,
    step: "01",
    title: "Open the App",
    description: "No downloads, no sign-ups. Just visit and you're ready to go.",
  },
  {
    icon: Search,
    step: "02",
    title: "Click Start Chat",
    description: "One tap connects you to our matching system instantly.",
  },
  {
    icon: MessageSquare,
    step: "03",
    title: "Get Matched",
    description: "We pair you with an available stranger in seconds.",
  },
  {
    icon: Heart,
    step: "04",
    title: "Chat Freely",
    description: "Talk about anything anonymously. Disconnect anytime.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-surface">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Four simple steps to start your anonymous journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
              )}
              
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto group-hover:border-primary transition-colors">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {step.step}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
