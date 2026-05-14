import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Upload, X, Loader2 } from "lucide-react";

interface BusinessFormData {
  businessName: string;
  description: string;
  category: string;
  subcategory: string;
  phone: string;
  email: string;
  website: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CompleteBusinessProfileForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: "",
    description: "",
    category: "",
    subcategory: "",
    phone: "",
    email: "",
    website: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if user is logged in as business
    const businessToken = localStorage.getItem("businessToken");
    if (!businessToken) {
      navigate("/business-login");
    }
  }, [navigate]);

  const categories = [
    "Restaurants & Food",
    "Home Services",
    "Business Services",
    "Healthcare & Medical",
    "Education",
    "Real Estate",
    "Automotive",
    "Shopping & Retail",
    "IT & Software",
    "Creative Arts & Design",
    "Legal Services",
    "Travel & Tourism",
    "Beauty & Spa",
    "Photography & Video",
    "Fitness & Gym",
    "Hotels & Lodging",
    "Transportation",
    "Electronics & Tech",
    "Pet Services",
    "Financial Services",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      
      // Validate files
      for (let file of newFiles) {
        if (!file.type.startsWith('image/')) {
          setErrorMessage('Please upload only image files');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setErrorMessage('Image size should be less than 5MB');
          return;
        }
      }

      // Add to images array
      setImages(prev => [...prev, ...newFiles].slice(0, 10)); // Max 10 images

      // Create previews
      const newPreviews: string[] = [];
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          setImagePreviews(prev => [...prev, ...newPreviews]);
        };
        reader.readAsDataURL(file);
      });

      setErrorMessage("");
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    } else if (formData.businessName.trim().length < 2) {
      newErrors.businessName = "Business name must be at least 2 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Business description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
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
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append('businessName', formData.businessName);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subcategory', formData.subcategory);
      
      // Add contact info as JSON
      formDataToSend.append('contact', JSON.stringify({
        phone: formData.phone,
        email: formData.email,
        website: formData.website
      }));

      // Add address as JSON
      formDataToSend.append('address', JSON.stringify({
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      }));

      // Add images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      // Get token from localStorage
      const token = localStorage.getItem('businessToken');
      if (!token) {
        setErrorMessage('Authentication required. Please login again.');
        navigate('/business-login');
        return;
      }

      // Send to backend
      const response = await fetch('http://localhost:5000/api/businesses/create-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create business profile');
      }

      setSuccessMessage(data.message || data.successMessage || '✅ Business profile created successfully!');
      
      // Reset form
      setTimeout(() => {
        setFormData({
          businessName: "",
          description: "",
          category: "",
          subcategory: "",
          phone: "",
          email: "",
          website: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "USA",
        });
        setImages([]);
        setImagePreviews([]);
        
        // Redirect to dashboard
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Failed to create business profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/98 backdrop-blur-xl">
          <CardHeader className="text-center pb-8 pt-8 border-b">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create Your Business Profile
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Add all your business details and images. This will be stored in our database.
            </p>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Success Alert */}
              {successMessage && (
                <Alert className="border-0 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 font-semibold">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <Alert variant="destructive" className="border-0">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
                  Basic Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-sm font-semibold">
                      Business Name *
                    </Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      type="text"
                      placeholder="Enter your business name"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className={`h-10 rounded-lg border-2 ${errors.businessName ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.businessName && (
                      <p className="text-red-500 text-sm">{errors.businessName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold">
                      Category *
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                      <SelectTrigger className={`h-10 rounded-lg border-2 ${errors.category ? 'border-red-500' : 'border-gray-200'}`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-500 text-sm">{errors.category}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">
                    Business Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your business (minimum 10 characters)"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`min-h-32 rounded-lg border-2 ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
                  Contact Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`h-10 rounded-lg border-2 ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="business@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`h-10 rounded-lg border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-semibold">
                      Website (Optional)
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="h-10 rounded-lg border-2 border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subcategory" className="text-sm font-semibold">
                      Subcategory (Optional)
                    </Label>
                    <Input
                      id="subcategory"
                      name="subcategory"
                      type="text"
                      placeholder="e.g., Italian, Electronics"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="h-10 rounded-lg border-2 border-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
                  Address Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="street" className="text-sm font-semibold">
                    Street Address
                  </Label>
                  <Input
                    id="street"
                    name="street"
                    type="text"
                    placeholder="123 Main Street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="h-10 rounded-lg border-2 border-gray-200"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-semibold">
                      City *
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="New York"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`h-10 rounded-lg border-2 ${errors.city ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-semibold">
                      State/Province *
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      placeholder="NY"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`h-10 rounded-lg border-2 ${errors.state ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm">{errors.state}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-sm font-semibold">
                      Zip Code
                    </Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      placeholder="10001"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="h-10 rounded-lg border-2 border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-semibold">
                      Country
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="h-10 rounded-lg border-2 border-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
                  Business Images (Optional - Max 10)
                </h3>

                <div className="space-y-4">
                  <label className="block">
                    <div className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload images or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 5MB (Max 10 images)
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isLoading || images.length >= 10}
                    />
                  </label>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-gray-600">
                    Images uploaded: {images.length}/10
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    '✅ Create Business Profile & Save to Database'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompleteBusinessProfileForm;
