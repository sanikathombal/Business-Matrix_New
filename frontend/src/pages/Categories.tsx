import { motion } from "framer-motion";
import {
  Utensils, Wrench, Briefcase, Heart, GraduationCap, Home,
  Car, ShoppingBag, Laptop, Palette, Scale, Plane,
  Scissors, Camera, Music, Dumbbell, Stethoscope, Building,
  Truck, Phone, Zap, Coffee, BookOpen, Gamepad2,
  Shield, Wrench as Tool, Hammer, Paintbrush, Microscope,
  DollarSign, Factory, Users, MoreHorizontal
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = [
  { name: "Restaurants", icon: Utensils, count: "8,500+", color: "bg-accent/10 text-accent" },
  { name: "Home Services", icon: Wrench, count: "5,200+", color: "bg-primary/10 text-primary" },
  { name: "Business Services", icon: Briefcase, count: "4,800+", color: "bg-success/10 text-success" },
  { name: "Healthcare", icon: Heart, count: "3,900+", color: "bg-destructive/10 text-destructive" },
  { name: "Education", icon: GraduationCap, count: "3,100+", color: "bg-primary/10 text-primary" },
  { name: "Real Estate", icon: Home, count: "6,700+", color: "bg-accent/10 text-accent" },
  { name: "Automotive", icon: Car, count: "2,400+", color: "bg-success/10 text-success" },
  { name: "Shopping", icon: ShoppingBag, count: "7,300+", color: "bg-destructive/10 text-destructive" },
  { name: "IT & Software", icon: Laptop, count: "4,100+", color: "bg-primary/10 text-primary" },
  { name: "Creative Arts", icon: Palette, count: "1,800+", color: "bg-accent/10 text-accent" },
  { name: "Legal", icon: Scale, count: "2,600+", color: "bg-success/10 text-success" },
  { name: "Travel", icon: Plane, count: "3,500+", color: "bg-primary/10 text-primary" },
  { name: "Beauty & Spa", icon: Scissors, count: "4,200+", color: "bg-pink-500/10 text-pink-500" },
  { name: "Photography", icon: Camera, count: "2,800+", color: "bg-purple-500/10 text-purple-500" },
  { name: "Fitness & Gym", icon: Dumbbell, count: "3,600+", color: "bg-orange-500/10 text-orange-500" },
  { name: "Hotels & Lodging", icon: Building, count: "5,400+", color: "bg-blue-500/10 text-blue-500" },
  { name: "Transportation", icon: Truck, count: "3,200+", color: "bg-gray-500/10 text-gray-500" },
  { name: "Electronics", icon: Zap, count: "4,900+", color: "bg-yellow-500/10 text-yellow-500" },
  { name: "Food Delivery", icon: Coffee, count: "6,100+", color: "bg-red-500/10 text-red-500" },
  { name: "Books & Stationery", icon: BookOpen, count: "2,300+", color: "bg-indigo-500/10 text-indigo-500" },
  { name: "Entertainment", icon: Gamepad2, count: "3,800+", color: "bg-teal-500/10 text-teal-500" },
  { name: "Security Services", icon: Shield, count: "2,900+", color: "bg-slate-500/10 text-slate-500" },
  { name: "Construction", icon: Hammer, count: "4,500+", color: "bg-amber-500/10 text-amber-500" },
  { name: "Event Planning", icon: Music, count: "3,300+", color: "bg-rose-500/10 text-rose-500" },
  { name: "Technology", icon: Laptop, count: "5,200+", color: "bg-cyan-500/10 text-cyan-500" },
  { name: "Retail", icon: ShoppingBag, count: "6,800+", color: "bg-emerald-500/10 text-emerald-500" },
  { name: "Finance", icon: DollarSign, count: "4,300+", color: "bg-green-500/10 text-green-500" },
  { name: "Manufacturing", icon: Factory, count: "3,700+", color: "bg-stone-500/10 text-stone-500" },
  { name: "Hospitality", icon: Building, count: "4,600+", color: "bg-violet-500/10 text-violet-500" },
  { name: "Professional Services", icon: Briefcase, count: "5,500+", color: "bg-lime-500/10 text-lime-500" },
  { name: "Other", icon: MoreHorizontal, count: "2,100+", color: "bg-neutral-500/10 text-neutral-500" },
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-xs font-semibold tracking-widest text-accent uppercase">Browse Categories</span>
            <h1 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
              Explore Business Categories
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover businesses across various categories. Find exactly what you're looking for in our comprehensive directory.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link
                  to={`/category/${encodeURIComponent(category.name)}`}
                  className="block h-full"
                >
                  <div className="h-full rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-accent/50">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${category.color} mb-4 transition-transform group-hover:scale-110`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} businesses
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Categories;