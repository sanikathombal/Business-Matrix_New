import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Search, LayoutGrid, ChevronDown, User, Building2, Plus, FileText, Home, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [businessMenuOpen, setBusinessMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBusinessLoggedIn, setIsBusinessLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsBusinessLoggedIn(localStorage.getItem("businessLoggedIn") === "true");
    setIsUserLoggedIn(localStorage.getItem("userLoggedIn") === "true");
    
    // Load approved businesses from localStorage
    const approvedBusinesses = JSON.parse(localStorage.getItem("approvedBusinesses") || "[]");
    const mappedBusinesses = approvedBusinesses.map((biz: any) => ({
      id: biz.id,
      name: biz.businessName,
      category: biz.industry,
    }));
    setBusinesses(mappedBusinesses);
  }, []);

  const handleSelectBusiness = (businessName: string) => {
    // Navigate to business details or category page
    const business = businesses.find(b => b.name === businessName);
    if (business) {
      navigate(`/category/${business.category}`);
    }
    setSearchOpen(false);
  };

  const searchResults = searchQuery.trim()
    ? businesses.filter(
        (business) =>
          business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const navLinks = [
    { label: "Home", href: "/#hero" },
    { label: "Categories", href: "/#categories" },
    { label: "Leads", href: "/#how-it-works" },
    { label: "Packages", href: "/#packages" },
    { label: "About Us", href: "/#footer" },
    { label: "Contact", href: "/#footer" },
  ];

  const handleUserLogout = () => {
    localStorage.removeItem("userLoggedIn");
    setIsUserLoggedIn(false);
    navigate("/");
  };

  const handleNavClick = (href: string) => {
    console.log('handleNavClick called with:', href);
    setIsOpen(false); // Close mobile menu
    if (href.startsWith('/#')) {
      // Navigate to home and scroll to section
      console.log('Navigating to home and scrolling to:', href.substring(2));
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(href.substring(2));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.log('Element not found:', href.substring(2));
        }
      }, 100);
    } else {
      // Regular navigation
      console.log('Regular navigation to:', href);
      navigate(href);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/#hero" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <LayoutGrid className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-heading font-bold text-foreground">
            Business<span className="text-accent">Matrix</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex relative">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="mr-1.5 h-4 w-4" /> Search
            </Button>

            {searchOpen && (
              <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-md shadow-lg min-w-max z-50">
                <div className="p-2 w-64">
                  <Input
                    type="text"
                    placeholder="Search businesses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="mb-2"
                  />

                  {searchResults.length > 0 ? (
                    <ul className="space-y-1 max-h-48 overflow-y-auto">
                      {searchResults.map((business) => (
                        <li
                          key={business.id}
                          onClick={() => handleSelectBusiness(business.name)}
                          className="px-3 py-2 hover:bg-muted cursor-pointer rounded transition-colors text-sm"
                        >
                          <p className="font-medium text-foreground">
                            {business.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {business.category}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : searchQuery.trim() ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      No results found
                    </div>
                  ) : (
                    <div className="py-2 text-xs text-muted-foreground">
                      <p className="mb-2 font-medium">Popular:</p>
                      <ul className="space-y-1">
                        {businesses.slice(0, 4).map((business) => (
                          <li
                            key={business.id}
                            onClick={() => handleSelectBusiness(business.name)}
                            className="px-2 py-1 hover:text-foreground cursor-pointer"
                          >
                            {business.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setBusinessMenuOpen(false);
              }}
              className="flex items-center gap-1"
            >
              <User className="h-4 w-4" />
              User
              <ChevronDown className="h-3 w-3" />
            </Button>
            
            {userMenuOpen && (
              <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-md shadow-lg min-w-max z-50">
                <div className="p-2">
                  {isUserLoggedIn ? (
                    <>
                      <Link to="/user-dashboard" className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <Home className="h-4 w-4 mr-2" />
                          My Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => navigate("/categories")}
                      >
                        <LayoutGrid className="h-4 w-4 mr-2" />
                        Categories
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleUserLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login-user" className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <User className="h-4 w-4 mr-2" />
                          User Login
                        </Button>
                      </Link>
                      <Link to="/register-user" className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <User className="h-4 w-4 mr-2" />
                          User Registration
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <Button
              variant="hero"
              size="sm"
              onClick={() => {
                setBusinessMenuOpen(!businessMenuOpen);
                setUserMenuOpen(false);
              }}
              className="flex items-center gap-1"
            >
              <Building2 className="h-4 w-4" />
              Business
              <ChevronDown className="h-3 w-3" />
            </Button>
            
            {businessMenuOpen && (
              <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-md shadow-lg min-w-max z-50">
                <div className="p-2">
                  <Link to="/business-login" className="block">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Building2 className="h-4 w-4 mr-2" />
                      Business Login
                    </Button>
                  </Link>
                  <Link to="/register-business" className="block">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Building2 className="h-4 w-4 mr-2" />
                      Business Registration
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>


        </div>

        <button
          className="lg:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 pt-2 lg:hidden">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="block py-2.5 text-sm font-medium text-muted-foreground"
            >
              {link.label}
            </button>
          ))}
          <div className="mt-3 space-y-2">
            <div className="border-t pt-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">User Account</p>
              {isUserLoggedIn ? (
                <>
                  <Link to="/user-dashboard" className="w-full block">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Home className="h-4 w-4 mr-2" />
                      My Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start mt-2"
                    onClick={() => navigate("/categories")}
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Categories
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start mt-2"
                    onClick={handleUserLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login-user" className="w-full block">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      User Login
                    </Button>
                  </Link>
                  <Link to="/register-user" className="w-full block mt-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      User Registration
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="border-t pt-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Business Account</p>
              <Link to="/business-login" className="w-full block">
                <Button variant="hero" size="sm" className="w-full justify-start">
                  <Building2 className="h-4 w-4 mr-2" />
                  Business Login
                </Button>
              </Link>
              <Link to="/register-business" className="w-full block mt-2">
                <Button variant="hero" size="sm" className="w-full justify-start">
                  <Building2 className="h-4 w-4 mr-2" />
                  Business Registration
                </Button>
              </Link>
            </div>

            {isBusinessLoggedIn && (
              <div className="border-t pt-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Business Dashboard</p>
                <Link to="/business-requirements" className="w-full block">
                  <Button variant="hero" size="sm" className="w-full justify-start">
                    <Building2 className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
