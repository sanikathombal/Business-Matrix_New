import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Eye, EyeOff, LogIn, Building2, AlertCircle, Shield } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { authAPI } from "@/lib/api";

const BusinessLoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: location.state?.password || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
    setLoginError("");
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
    setLoginError("");

    try {
      const response = await authAPI.businessLogin({
        email: formData.email,
        password: formData.password,
      });

      console.log("Business login successful:", response);
      
      // Store token and user data in localStorage
      localStorage.setItem("businessToken", response.token);
      localStorage.setItem("businessUser", JSON.stringify(response.user));
      localStorage.setItem("businessLoggedIn", "true");
      localStorage.setItem("businessEmail", response.user.businessEmail);
      localStorage.setItem("businessName", response.user.businessName);

      // Redirect to business dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Business login error:", error);
      setLoginError(error.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                <div className="flex flex-col items-center justify-center">
                  <Building2 className="h-14 w-14 text-gray-400 mb-2" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                Business Login
              </CardTitle>
              <p className="text-sm text-gray-600 font-medium">
                Sign in to your business account to manage leads and growth
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {loginError && (
              <Alert variant="destructive" className="mb-6 border-0 shadow-lg">
                <AlertDescription className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {loginError}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                Email Address*
              </Label>
              <div className="relative group">
                <Input
                  id="email"
                  type="email"
                  placeholder="business@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, "email")}
                  className={`h-12 rounded-xl border-2 transition-all duration-300 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-300"} focus:ring-2 focus:ring-opacity-50`}
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 font-medium animate-pulse">{errors.email}</p>
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange(e, "password")}
                  className={`pl-10 pr-10 h-12 rounded-xl border-2 transition-all duration-300 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-300"} focus:ring-2 focus:ring-opacity-50`}
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
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
                  <Shield className="h-4 w-4" />
                  {errors.password}
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
                    <div>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      <span className="ml-2">Signing In...</span>
                    </div>
                  ) : (
                    <div>
                      <LogIn className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="transition-transform duration-300 group-hover:translate-x-1">Sign In</span>
                    </div>
                  )}
                </div>
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register-business"
                className="text-primary hover:underline font-semibold"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BusinessLoginForm;
