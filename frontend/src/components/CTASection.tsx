import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-hero-gradient p-12 text-center md:p-16"
        >
          <div className="absolute inset-0 bg-hero-pattern" />
          <div className="relative z-10">
            <Sparkles className="mx-auto h-10 w-10 text-accent" />
            <h2 className="mt-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Grow Your Business?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-primary-foreground/70">
              Join 50,000+ businesses already using BusinessMatrix to attract customers and generate leads.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button variant="hero" size="lg" className="rounded-xl px-8">
                Register Free <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button variant="hero-outline" size="lg" className="rounded-xl px-8">
                View Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
