import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Phone, ExternalLink, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { businessAPI } from "@/lib/api";

const FeaturedBusinesses = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const approvedBusinesses = await businessAPI.getAll({ status: 'approved', limit: '4' });
        const mappedBusinesses = approvedBusinesses.map((biz: any) => ({
          name: biz.businessName,
          category: biz.industry,
          location: `${biz.city || 'Unknown'}, ${biz.state || 'Unknown'}`,
          rating: 4.5,
          reviews: 0,
          image: biz.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop",
          verified: true,
          tags: [biz.businessType, biz.selectedPackage],
          phone: biz.phone,
          address: `${biz.address || 'Address'}, ${biz.city || ''} ${biz.state || ''}`,
          description: biz.description,
        }));

        setBusinesses(mappedBusinesses);
      } catch (error) {
        console.error('Failed to load featured businesses:', error);
        const approvedBusinesses = JSON.parse(localStorage.getItem("approvedBusinesses") || "[]");
        const mappedBusinesses = approvedBusinesses.map((biz: any) => ({
          name: biz.businessName,
          category: biz.industry,
          location: `${biz.city}, ${biz.state}`,
          rating: 4.5,
          reviews: 0,
          image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop",
          verified: true,
          tags: [biz.businessType, biz.selectedPackage],
          phone: biz.phone,
          address: `${biz.address}, ${biz.city}, ${biz.state} ${biz.zipCode}`,
          description: biz.description,
        }));

        setBusinesses(mappedBusinesses);
      }
    };

    loadBusinesses();
  }, []);
  return (
    <section className="bg-muted/50 py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"
        >
          <div>
            <span className="text-xs font-semibold tracking-widest text-accent uppercase">Top Rated</span>
            <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">Featured Businesses</h2>
            <p className="mt-2 text-muted-foreground">Hand-picked, verified businesses trusted by thousands</p>
          </div>
          <Button variant="outline">View All Businesses <ExternalLink className="ml-1.5 h-3.5 w-3.5" /></Button>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {businesses.map((biz, i) => (
            <motion.div
              key={biz.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card transition-all duration-300 hover:shadow-card-hover"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={biz.image}
                  alt={biz.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {biz.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-medium text-foreground backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="flex items-center gap-1.5 text-base font-semibold text-foreground">
                      {biz.name}
                      {biz.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                    </h3>
                    <p className="text-xs text-muted-foreground">{biz.category}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-accent/10 px-2 py-1">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="text-xs font-bold text-accent">{biz.rating}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {biz.location}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{biz.reviews} reviews</div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1 text-xs">Get Quote</Button>
                  <Button size="sm" variant="outline" className="px-3">
                    <Phone className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
