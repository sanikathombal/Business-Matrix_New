import { motion } from "framer-motion";
import { Check, Zap, Crown, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const packages = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for new businesses getting started",
    icon: Zap,
    features: [
      "Basic business listing",
      "Up to 5 photos",
      "10 leads/month",
      "Standard support",
      "Basic analytics",
    ],
    popular: false,
    cta: "Get Started Free",
    variant: "outline" as const,
  },
  {
    name: "Professional",
    price: "₹2,999",
    period: "/month",
    description: "For growing businesses wanting more visibility",
    icon: Crown,
    features: [
      "Featured listing",
      "Unlimited photos & videos",
      "100 leads/month",
      "Priority support",
      "Advanced analytics",
      "Marketing post tools",
      "Lead management CRM",
    ],
    popular: true,
    cta: "Start 14-Day Trial",
    variant: "hero" as const,
  },
  {
    name: "Enterprise",
    price: "₹9,999",
    period: "/month",
    description: "Maximum exposure for established businesses",
    icon: Rocket,
    features: [
      "Premium listing + badge",
      "Unlimited everything",
      "Unlimited leads",
      "Dedicated manager",
      "Custom analytics & reports",
      "Ad campaign tools",
      "API access",
      "Multi-location support",
    ],
    popular: false,
    cta: "Contact Sales",
    variant: "outline" as const,
  },
];

const PackagesSection = () => {
  return (
    <section id="packages" className="py-20 bg-muted/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-xs font-semibold tracking-widest text-accent uppercase">Pricing Plans</span>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">Choose Your Package</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Flexible plans designed to match your business size and goals
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col rounded-2xl border bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover ${
                pkg.popular ? "border-accent scale-[1.02]" : "border-border/50"
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-accent-foreground">
                  Most Popular
                </span>
              )}

              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${pkg.popular ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                  <pkg.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{pkg.name}</h3>
                  <p className="text-xs text-muted-foreground">{pkg.description}</p>
                </div>
              </div>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">{pkg.price}</span>
                <span className="text-sm text-muted-foreground">{pkg.period}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className={`h-4 w-4 shrink-0 ${pkg.popular ? "text-accent" : "text-primary"}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button variant={pkg.variant} size="lg" className="mt-8 w-full rounded-xl">
                {pkg.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
