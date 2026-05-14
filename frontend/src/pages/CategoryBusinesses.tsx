import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Phone, ExternalLink, BadgeCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { businessAPI } from "@/lib/api";

const CategoryBusinesses = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const category = categoryName ? decodeURIComponent(categoryName) : '';
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const approvedBusinesses = await businessAPI.getAll({ status: 'approved', industry: category });
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
        console.error('Failed to load approved businesses:', error);
        const approvedBusinesses = JSON.parse(localStorage.getItem("approvedBusinesses") || "[]");
        const mappedBusinesses = approvedBusinesses
          .filter((biz: any) => biz.industry === category)
          .map((biz: any) => ({
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
  }, [category]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              {category} Businesses
            </h1>
            <p className="mt-2 text-muted-foreground">
              Discover verified businesses in {category?.toLowerCase()}
            </p>
          </motion.div>
        </div>

        {/* Business List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((biz, i) => (
            <motion.div
              key={biz.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                {biz.verified && (
                  <div className="absolute top-3 right-3">
                    <BadgeCheck className="h-5 w-5 text-primary bg-card/90 rounded-full p-1 backdrop-blur-sm" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {biz.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{biz.category}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-accent/10 px-2 py-1">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="text-sm font-bold text-accent">{biz.rating}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {biz.location}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {biz.reviews} reviews
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {biz.phone}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {biz.description}
                </p>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 text-sm">
                    Get Quote
                  </Button>
                  <Button size="sm" variant="outline" className="px-3">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="px-3">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {businesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No businesses found in this category.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryBusinesses;