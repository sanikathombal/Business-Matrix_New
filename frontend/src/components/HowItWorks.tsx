import { motion } from "framer-motion";
import { UserPlus, Search, Handshake, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Register Your Business",
    description: "Create a free account and set up your business profile with details, photos, and services.",
    step: "01",
  },
  {
    icon: Search,
    title: "Get Discovered",
    description: "Customers find your business through search, categories, and location-based browsing.",
    step: "02",
  },
  {
    icon: Handshake,
    title: "Receive Quality Leads",
    description: "Get genuine enquiries and leads from interested customers directly in your dashboard.",
    step: "03",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Convert leads, build reputation with reviews, and scale with premium marketing tools.",
    step: "04",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-xs font-semibold tracking-widest text-accent uppercase">Simple Process</span>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">How It Works</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Start getting leads in minutes — no technical skills required
          </p>
        </motion.div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-4">
          {/* Connector line */}
          <div className="absolute top-12 left-[10%] right-[10%] hidden h-0.5 bg-border md:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl bg-card shadow-card border border-border/50">
                <step.icon className="h-8 w-8 text-primary" />
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                  {step.step}
                </span>
              </div>
              <h3 className="mt-6 text-base font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
