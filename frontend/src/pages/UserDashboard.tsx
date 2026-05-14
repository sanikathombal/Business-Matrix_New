import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { businessAPI, jobAPI } from "@/lib/api";
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Globe, 
  Clock,
  TrendingUp,
  Users,
  Building2,
  Home,
  Settings,
  Heart,
  History,
  Filter,
  Grid3X3,
  List,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ClipboardList,
  XCircle,
  Briefcase,
  Wrench,
  Tag
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    if (localStorage.getItem("userLoggedIn") !== "true") {
      navigate("/login-user");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const approvedJobs = await jobAPI.getAll({ status: 'approved' });
        const formattedJobs = approvedJobs.map((v: any) => ({
          id: v.id,
          title: v.title,
          company: v.company,
          location: v.location,
          type: "Full-time",
          salary: v.salary,
          description: v.description,
          posted: v.submittedAt ? new Date(v.submittedAt).toLocaleDateString() : "Recently",
        }));
        setJobs(formattedJobs);
      } catch (error) {
        console.error('Failed to load approved jobs:', error);
        const approvedVacancies = JSON.parse(localStorage.getItem("approvedVacancies") || "[]");
        const formattedJobs = approvedVacancies.map((v: any) => ({
          id: v.id,
          title: v.title,
          company: v.company,
          location: v.location,
          type: "Full-time",
          salary: v.salary,
          description: v.description,
          posted: "Recently",
        }));
        setJobs(formattedJobs);
      }

      try {
        const approvedBusinesses = await businessAPI.getAll({ status: 'approved' });
        setBusinesses(approvedBusinesses);
      } catch (error) {
        console.error('Failed to load approved businesses:', error);
        const approvedBusinesses = JSON.parse(localStorage.getItem("approvedBusinesses") || "[]");
        setBusinesses(approvedBusinesses);
      }
    };

    fetchData();
  }, []);

  // Mock user data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    memberSince: "January 2024",
    totalConnections: 15,
    favoriteBusinesses: 8,
    lastLogin: "2 hours ago",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate entrepreneur and business enthusiast looking to connect with amazing local businesses."
  };

  const featuredBusinesses = [
    {
      id: 1,
      name: "Tech Solutions Inc.",
      category: "Technology",
      rating: 4.8,
      reviews: 124,
      address: "123 Tech Street, Silicon Valley, CA",
      phone: "+1 (555) 123-4567",
      email: "info@techsolutions.com",
      website: "https://techsolutions.com",
      description: "Leading technology solutions provider for businesses of all sizes.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Green Garden Restaurant",
      category: "Restaurant",
      rating: 4.6,
      reviews: 89,
      address: "456 Garden Ave, Portland, OR",
      phone: "+1 (555) 234-5678",
      email: "hello@greengarden.com",
      website: "https://greengarden.com",
      description: "Farm-to-table dining experience with organic, locally-sourced ingredients.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "FitLife Gym",
      category: "Health & Fitness",
      rating: 4.9,
      reviews: 156,
      address: "789 Fitness Blvd, Austin, TX",
      phone: "+1 (555) 345-6789",
      email: "join@fitlife.com",
      website: "https://fitlife.com",
      description: "State-of-the-art fitness facility with personal training and group classes.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Digital Marketing Pro",
      category: "Marketing",
      rating: 4.7,
      reviews: 92,
      address: "321 Market St, New York, NY",
      phone: "+1 (555) 456-7890",
      email: "grow@digitalmarketingpro.com",
      website: "https://digitalmarketingpro.com",
      description: "Full-service digital marketing agency helping businesses grow online.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      name: "Eco Clean Services",
      category: "Cleaning",
      rating: 4.5,
      reviews: 67,
      address: "654 Clean Ave, Seattle, WA",
      phone: "+1 (555) 567-8901",
      email: "info@ecoclean.com",
      website: "https://ecoclean.com",
      description: "Eco-friendly cleaning services for residential and commercial properties.",
      image: "https://images.unsplash.com/photo-1581578261546-f7d4c2b0c9e1?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      name: "Legal Eagles Law Firm",
      category: "Legal Services",
      rating: 4.9,
      reviews: 203,
      address: "987 Justice Blvd, Washington, DC",
      phone: "+1 (555) 678-9012",
      email: "contact@legaleagles.com",
      website: "https://legaleagles.com",
      description: "Experienced legal team providing expert legal advice and representation.",
      image: "https://images.unsplash.com/photo-1589829545856-d3d2c2a5a1be?w=400&h=300&fit=crop"
    }
  ];

  const services = [
    {
      id: 1,
      name: "Web Development",
      provider: "Tech Solutions Inc.",
      category: "Technology",
      price: "$500 - $5,000",
      description: "Custom website development and maintenance services.",
      rating: 4.8
    },
    {
      id: 2,
      name: "Legal Consultation",
      provider: "Legal Eagles Law Firm",
      category: "Legal",
      price: "$150 - $300 per hour",
      description: "Professional legal advice and consultation services.",
      rating: 4.9
    },
    {
      id: 3,
      name: "House Cleaning",
      provider: "Eco Clean Services",
      category: "Cleaning",
      price: "$100 - $200",
      description: "Eco-friendly residential and commercial cleaning.",
      rating: 4.5
    }
  ];

  const coupons = [
    {
      id: 1,
      title: "20% Off Italian Cuisine",
      business: "Green Garden Restaurant",
      discount: "20%",
      validUntil: "2026-04-15",
      description: "Enjoy 20% off on all Italian dishes.",
      code: "ITALY20"
    },
    {
      id: 2,
      title: "Free Personal Training Session",
      business: "FitLife Gym",
      discount: "Free Session",
      validUntil: "2026-03-30",
      description: "Get a free personal training session with our certified trainers.",
      code: "FITFREE"
    },
    {
      id: 3,
      title: "15% Off Legal Consultation",
      business: "Legal Eagles Law Firm",
      discount: "15%",
      validUntil: "2026-05-01",
      description: "15% discount on initial legal consultation.",
      code: "LEGAL15"
    }
  ];

  const categories = [
    { id: "all", name: "All Businesses", icon: Building2 },
    { id: "jobs", name: "Jobs", icon: Briefcase },
    { id: "services", name: "Services", icon: Wrench },
    { id: "coupons", name: "Coupons", icon: Tag }
  ];

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BusinessMatrix
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-slate-50 border-slate-200 focus:border-blue-500"
              />
            </div>
            
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUserProfileOpen(true)}
                className="p-1"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out`}>
          <nav className="p-4 space-y-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <IconComponent className="h-4 w-4 mr-3" />
                  {category.name}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Businesses</p>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Categories</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <Grid3X3 className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">New This Week</p>
                    <p className="text-2xl font-bold">28</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Favorites</p>
                    <p className="text-2xl font-bold">15</p>
                  </div>
                  <Heart className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {selectedCategory === "all" ? "All Businesses" :
                 selectedCategory === "jobs" ? "Job Opportunities" :
                 selectedCategory === "services" ? "Available Services" :
                 "Active Coupons"}
              </h2>
              <p className="text-slate-600">
                {selectedCategory === "all" ? "Discover amazing businesses in your area" :
                 selectedCategory === "jobs" ? "Find your next career opportunity" :
                 selectedCategory === "services" ? "Browse professional services and solutions" :
                 "Save money with exclusive coupons and discounts"}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative md:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-40"
                />
              </div>
              
              {selectedCategory === "all" && (
                <>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Content Grid */}
          {selectedCategory === "all" && (
            <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {filteredBusinesses.map((business) => (
                <Card key={business.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-video bg-slate-100 overflow-hidden">
                      <img 
                        src={business.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop"} 
                        alt={business.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-slate-800">
                      {business.industry}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{business.businessName}</CardTitle>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">4.5</span>
                            <span className="text-sm text-slate-500">(New)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {business.description}
                    </p>
                    
                    <div className="space-y-1 text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{business.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{business.phone}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        <Mail className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Globe className="h-3 w-3 mr-1" />
                        Visit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedCategory === "jobs" && (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{job.company}</Badge>
                          <Badge className={
                            job.type === "Full-time" ? "bg-green-100 text-green-800" :
                            "bg-blue-100 text-blue-800"
                          }>
                            {job.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-600 mb-4">
                      {job.description}
                    </p>
                    
                    <div className="space-y-2 text-xs text-slate-500 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Location:</span>
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Salary:</span>
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Posted:</span>
                        <span>{job.posted}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                        <Mail className="h-3 w-3 mr-1" />
                        Apply
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Heart className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedCategory === "services" && (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{service.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{service.provider}</Badge>
                          <Badge className="bg-purple-100 text-purple-800">
                            {service.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-600 mb-4">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2 text-xs text-slate-500 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Price:</span>
                        <span>{service.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{service.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        <Mail className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Globe className="h-3 w-3 mr-1" />
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedCategory === "coupons" && (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredCoupons.map((coupon) => (
                <Card key={coupon.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{coupon.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{coupon.business}</Badge>
                          <Badge className="bg-red-100 text-red-800">
                            {coupon.discount}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-600 mb-4">
                      {coupon.description}
                    </p>
                    
                    <div className="space-y-2 text-xs text-slate-500 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Valid Until:</span>
                        <span>{coupon.validUntil}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Code:</span>
                        <span className="font-mono font-bold text-slate-800">{coupon.code}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                        <Tag className="h-3 w-3 mr-1" />
                        Claim Coupon
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Heart className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* User Profile Popup */}
      {userProfileOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Popup Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">User Profile</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUserProfileOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>

            {/* User Info */}
            <div className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{userData.name}</h3>
                <p className="text-slate-600">{userData.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
