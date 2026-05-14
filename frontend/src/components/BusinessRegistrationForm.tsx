import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Eye, EyeOff, Building2, User, Phone, Camera, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "@/lib/api";
import PasswordStrength from "@/components/ui/password-strength";

const BusinessRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    businessEmail: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
    setRegistrationError("");
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setRegistrationError("Please upload an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setRegistrationError("Image size should be less than 5MB");
        return;
      }

      setProfileImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    } else if (formData.businessName.trim().length < 2) {
      newErrors.businessName = "Business name must be at least 2 characters";
    }

    if (!formData.businessEmail.trim()) {
      newErrors.businessEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail)) {
      newErrors.businessEmail = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9\-+()\s]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      // Strong password validation
      const requirements = [
        { regex: /.{8,}/, message: "Password must be at least 8 characters" },
        { regex: /[A-Z]/, message: "Password must contain at least one uppercase letter" },
        { regex: /[a-z]/, message: "Password must contain at least one lowercase letter" },
        { regex: /[0-9]/, message: "Password must contain at least one number" },
        { regex: /[!@#$%^&*(),.?":{}|<>]/, message: "Password must contain at least one special character" }
      ];
      
      const failedRequirements = requirements.filter(req => !req.regex.test(formData.password));
      if (failedRequirements.length > 0) {
        newErrors.password = failedRequirements[0].message;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
    setRegistrationError("");

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('businessName', formData.businessName);
      formDataToSend.append('businessEmail', formData.businessEmail);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('password', formData.password);
      
      if (profileImageFile) {
        formDataToSend.append('profileImage', profileImageFile);
      }

      // Call the business registration API
      const response = await authAPI.businessRegister(formDataToSend);

      console.log("Business registration successful:", response);
      
      // Store business data in localStorage
      localStorage.setItem("businessUser", JSON.stringify(response.user));
      localStorage.setItem("businessToken", response.token);
      localStorage.setItem("businessLoggedIn", "true");

      // Show success and redirect to login
      alert("✅ Business registered successfully! Redirecting to login...");
      
      // Redirect to business login with prefilled credentials
      navigate("/business-login", {
        state: {
          email: formData.businessEmail,
          password: formData.password,
        },
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegistrationError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const packages = [
    {
      id: "starter",
      name: "Starter",
      price: "$29/month",
      features: ["Up to 10 leads/month", "Basic analytics", "Email support"],
    },
    {
      id: "professional",
      name: "Professional",
      price: "$99/month",
      features: ["Up to 50 leads/month", "Advanced analytics", "Priority support"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      features: ["Unlimited leads", "Full analytics", "24/7 support", "Custom integrations"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/98 backdrop-blur-xl max-h-none relative overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <CardHeader className="text-center pb-6 pt-8 relative">
          {/* Centered Avatar and Heading */}
          <div className="flex flex-col items-center space-y-6">
            {/* Profile Image Upload */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <Building2 className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <label 
                htmlFor="profile-upload" 
                className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center cursor-pointer shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-3xl group"
              >
                <Camera className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-12" />
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                Register and Grow Your Business
              </CardTitle>
              <p className="text-sm text-gray-600 font-medium">
                Create your business account and start building a stronger presence
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {registrationError && (
              <Alert variant="destructive" className="mb-6 border-0 shadow-lg">
                <AlertDescription className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {registrationError}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                Business Name*
              </Label>
              <div className="relative group">
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Your Business Name"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange(e, "businessName")}
                  className={`h-12 rounded-xl border-2 transition-all duration-300 ${errors.businessName ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-300"} focus:ring-2 focus:ring-opacity-50`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                {errors.businessName && (
                  <p className="text-red-500 text-sm mt-2 font-medium animate-pulse">{errors.businessName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessEmail" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                Business Email*
              </Label>
              <div className="relative group">
                <Input
                  id="businessEmail"
                  type="email"
                  placeholder="business@example.com"
                  value={formData.businessEmail}
                  onChange={(e) => handleInputChange(e, "businessEmail")}
                  className={`h-12 rounded-xl border-2 transition-all duration-300 ${errors.businessEmail ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-300"} focus:ring-2 focus:ring-opacity-50`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                {errors.businessEmail && (
                  <p className="text-red-500 text-sm mt-2 font-medium animate-pulse">{errors.businessEmail}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                Phone Number*
              </Label>
              <div className="relative group">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={(e) => handleInputChange(e, "phone")}
                  className={`h-12 rounded-xl border-2 transition-all duration-300 ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-300"} focus:ring-2 focus:ring-opacity-50`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-2 font-medium animate-pulse">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-600" />
                Password*
              </Label>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange(e, "password")}
                  className={`pl-10 pr-10 h-12 rounded-xl border-2 transition-all duration-300 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-300"} focus:ring-2 focus:ring-opacity-50`}
                  disabled={isLoading}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 font-medium animate-pulse flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <PasswordStrength password={formData.password} />
            )}

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-600" />
                Confirm Password*
              </Label>
              <div className="relative group">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange(e, "confirmPassword")}
                  className={`pl-10 pr-10 h-12 rounded-xl border-2 transition-all duration-300 ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-300"} focus:ring-2 focus:ring-opacity-50`}
                  disabled={isLoading}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2 font-medium animate-pulse flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.confirmPassword}
                </p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-green-500 text-sm mt-2 font-medium flex items-center gap-2 animate-pulse">
                  <CheckCircle className="h-4 w-4" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-3xl relative overflow-hidden group"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      <span className="ml-2">Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="transition-transform duration-300 group-hover:translate-x-1">Create Business Account</span>
                    </>
                  )}
                </div>
              </Button>
            </div>
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have a business account?{" "}
              <Link
                to="/business-login"
                className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessRegistrationForm;
