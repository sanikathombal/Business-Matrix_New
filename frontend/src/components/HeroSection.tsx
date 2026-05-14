import { motion } from "framer-motion";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const stats = [
  { value: "50K+", label: "Businesses" },
  { value: "1M+", label: "Leads Generated" },
  { value: "200+", label: "Cities" },
  { value: "98%", label: "Satisfaction" },
];

// Mock business data
const mockBusinesses = [
  { id: 1, name: "Tech Solutions Inc", category: "Technology" },
  { id: 2, name: "Health Care Plus", category: "Healthcare" },
  { id: 3, name: "Retail Hub", category: "Retail" },
  { id: 4, name: "Finance Pro", category: "Finance" },
  { id: 5, name: "Real Estate Kings", category: "Real Estate" },
  { id: 6, name: "Manufacturing Co", category: "Manufacturing" },
  { id: 7, name: "Education Academy", category: "Education" },
  { id: 8, name: "Hotel & Spa", category: "Hospitality" },
];

// Mock locations
const mockLocations = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
];

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showLocationResults, setShowLocationResults] = useState(false);

  // Filter businesses based on search query
  const searchResults = searchQuery.trim()
    ? mockBusinesses.filter(
        (business) =>
          business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockBusinesses;

  // Filter locations
  const locationResults = location.trim()
    ? mockLocations.filter((loc) =>
        loc.toLowerCase().includes(location.toLowerCase())
      )
    : mockLocations;

  const handleSelectBusiness = (businessName: string) => {
    setSearchQuery(businessName);
    setShowSearchResults(false);
    console.log("Selected business:", businessName);
  };

  const handleSelectLocation = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setShowLocationResults(false);
    console.log("Selected location:", selectedLocation);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery, "in", location);
    // In a real app, you would navigate to search results page here
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-hero-gradient bg-hero-pattern py-20 md:py-28">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary-foreground/5 blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-medium tracking-wide text-black-foreground uppercase">
            India's #1 Business Directory — BusinessMatrix
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-black-foreground md:text-6xl">
            Discover & Connect{" "}
            <span className="relative">
              With Local
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M2 6C50 2 150 2 198 6" stroke="hsl(32 95% 52%)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>{" "}
            Businesses
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-black-foreground/70 md:text-xl">
            Find trusted businesses, generate quality leads, and grow your network across 200+ cities.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="flex flex-col gap-2 rounded-2xl bg-card/95 p-2 shadow-2xl backdrop-blur-lg md:flex-row">
            {/* Business Search */}
            <div className="relative flex-1">
              <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-4 py-3">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search businesses, services..."
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                />
              </div>

              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <ul className="divide-y divide-border">
                      {searchResults.map((business) => (
                        <li
                          key={business.id}
                          onClick={() => handleSelectBusiness(business.name)}
                          className="px-4 py-2 hover:bg-muted cursor-pointer transition-colors"
                        >
                          <p className="text-sm font-medium text-foreground">
                            {business.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {business.category}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-4 text-center text-sm text-muted-foreground">
                      No businesses found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Location Search */}
            <div className="relative flex-1">
              <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-4 py-3">
                <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="City or locality"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setShowLocationResults(true)}
                />
              </div>

              {showLocationResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                  {locationResults.length > 0 ? (
                    <ul className="divide-y divide-border">
                      {locationResults.map((loc) => (
                        <li
                          key={loc}
                          onClick={() => handleSelectLocation(loc)}
                          className="px-4 py-2 hover:bg-muted cursor-pointer transition-colors text-sm text-foreground"
                        >
                          {loc}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-4 text-center text-sm text-muted-foreground">
                      No locations found
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              variant="hero"
              size="lg"
              className="rounded-xl px-8"
              onClick={handleSearch}
            >
              Search <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <p className="mt-3 text-center text-xs text-black-foreground/50">
            Popular: Restaurants, Plumbers, CA Firms, IT Services, Interior Designers
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-6 md:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-black-foreground md:text-3xl">{stat.value}</div>
              <div className="mt-1 text-xs text-black-foreground/60 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
