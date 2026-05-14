import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  MapPin, 
  Phone, 
  Mail,
  Globe,
  Users,
  Target,
  TrendingUp,
  ArrowRight,
  LayoutDashboard
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const BusinessRequirements = () => {
  const navigate = useNavigate();
  const [isBusinessLoggedIn, setIsBusinessLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    employees: "",
    targetMarket: "",
    businessGoals: "",
    currentChallenges: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const loggedIn = localStorage.getItem("businessLoggedIn") === "true";
    setIsBusinessLoggedIn(loggedIn);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!formData.businessType) {
      newErrors.businessType = "Business type is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Business description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Business address is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.employees) {
      newErrors.employees = "Number of employees is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Business requirements submitted:", formData);
      setSubmitStatus("success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Business Requirements Submitted!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for providing your business information. We'll review your requirements and get back to you soon.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Redirecting to your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show dashboard access for logged-in business users
  if (isBusinessLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Building2 className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl font-bold mb-4">Welcome to BusinessMatrix</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your business dashboard is ready. Manage your listings, post jobs, and grow your business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/dashboard">
                  <Button size="lg" className="flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5" />
                    Go to Business Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                
                <div className="text-sm text-muted-foreground">
                  <p>Access your sidebar navigation to:</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    <Badge variant="secondary">Add Business</Badge>
                    <Badge variant="secondary">Add Jobs</Badge>
                    <Badge variant="secondary">Add Services</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="text-center">
                <CardHeader>
                  <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>Business Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Create and manage your business profiles visible to customers.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>Job Postings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Post job vacancies and track approval status from admins.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>Service Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Add and manage the services your business provides.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Business Requirements</h1>
          <p className="text-lg text-muted-foreground">
            Tell us about your business so we can help you grow and connect with customers
          </p>
        </div>

        {submitStatus === "error" && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to submit your requirements. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Tell us about your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Your Business Name"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange(e, "businessName")}
                    className={errors.businessName ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => handleSelectChange(value, "businessType")}
                    disabled={isLoading}
                  >
                    <SelectTrigger className={errors.businessType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="service">Service Provider</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.businessType && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="employees">Number of Employees *</Label>
                  <Select
                    value={formData.employees}
                    onValueChange={(value) => handleSelectChange(value, "employees")}
                    disabled={isLoading}
                  >
                    <SelectTrigger className={errors.employees ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="11-50">11-50</SelectItem>
                      <SelectItem value="51-100">51-100</SelectItem>
                      <SelectItem value="101-500">101-500</SelectItem>
                      <SelectItem value="500+">500+</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.employees && (
                    <p className="text-red-500 text-sm mt-1">{errors.employees}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Business Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your business, products, and services..."
                    value={formData.description}
                    onChange={(e) => handleInputChange(e, "description")}
                    className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  How customers can reach you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Business Address *</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State"
                    value={formData.address}
                    onChange={(e) => handleInputChange(e, "address")}
                    className={errors.address ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange(e, "phone")}
                    className={errors.phone ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="business@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange(e, "email")}
                    className={errors.email ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    placeholder="https://yourbusiness.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange(e, "website")}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Business Goals & Challenges
              </CardTitle>
              <CardDescription>
                Help us understand your needs better
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetMarket">Target Market</Label>
                  <Textarea
                    id="targetMarket"
                    placeholder="Who are your ideal customers?"
                    value={formData.targetMarket}
                    onChange={(e) => handleInputChange(e, "targetMarket")}
                    className="min-h-[80px]"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="businessGoals">Business Goals</Label>
                  <Textarea
                    id="businessGoals"
                    placeholder="What are your main business objectives?"
                    value={formData.businessGoals}
                    onChange={(e) => handleInputChange(e, "businessGoals")}
                    className="min-h-[80px]"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="currentChallenges">Current Challenges</Label>
                <Textarea
                  id="currentChallenges"
                  placeholder="What challenges are you currently facing in your business?"
                  value={formData.currentChallenges}
                  onChange={(e) => handleInputChange(e, "currentChallenges")}
                  className="min-h-[100px]"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="px-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Submitting Requirements...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Business Requirements
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Customer Acquisition
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Business Growth
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              Market Expansion
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessRequirements;
