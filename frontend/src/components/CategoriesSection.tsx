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

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-xs font-semibold tracking-widest text-accent uppercase">Browse Categories</span>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
            Explore Business Categories
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Find the right business across dozens of industries and services
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/category/${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 block"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${cat.color} transition-transform duration-300 group-hover:scale-110`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-foreground">{cat.name}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{cat.count}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
