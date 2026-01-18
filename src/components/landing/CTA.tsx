import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-glow" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-8 shadow-glow"
          >
            <MessageCircle className="h-8 w-8 text-primary-foreground" />
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Meet Someone{" "}
            <span className="text-gradient">New</span>?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of people having meaningful conversations every day. 
            Your next great conversation is just a click away.
          </p>

          <Link to="/chat">
            <Button variant="hero" size="xl" className="group">
              Start Your First Chat
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <p className="mt-6 text-sm text-muted-foreground">
            No sign-up required • 100% Anonymous • Free forever
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
