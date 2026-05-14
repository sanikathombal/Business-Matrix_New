import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { businessAPI } from "@/lib/api";
import { Heart, Star, MapPin, Phone, Mail, Globe, Upload, X } from "lucide-react";

interface FormData {
  businessName: string;
  categories: string;
  businessType: string;
  website: string;
  description: string;
  agreeTerms: boolean;
  image: string;
  address: string;
  phone: string;
}

interface Props {
  onSuccess?: () => void;
}

const AddBusinessForm = ({ onSuccess }: Props) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    categories: "",
    businessType: "",
    website: "",
    description: "",
    agreeTerms: false,
    image: "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const toast = useToast();

  useEffect(() => {
    if (localStorage.getItem("businessLoggedIn") !== "true") {
      navigate("/business-login");
      return;
    }

    if (isEditing && id) {
      businessAPI.getById(id)
        .then((business) => {
          setFormData({
            businessName: business.businessName || "",
            categories: business.industry || "",
            businessType: business.businessType || "",
            website: business.website || "",
            description: business.description || "",
            agreeTerms: false,
            image: business.image || "",
            address: business.address || "",
            phone: business.phone || "",
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to load business for editing:', error);
          toast.toast({
            title: "Error",
            description: "Failed to load business data for editing.",
            variant: "destructive",
          });
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id, isEditing, navigate, toast.toast]);

  const industries = [
    "Restaurants",
    "Home Services",
    "Business Services",
    "Healthcare",
    "Education",
    "Real Estate",
    "Automotive",
    "Shopping",
    "IT & Software",
    "Creative Arts",
    "Legal",
    "Travel",
    "Beauty & Spa",
    "Photography",
    "Fitness & Gym",
    "Hotels & Lodging",
    "Transportation",
    "Electronics",
    "Food Delivery",
    "Books & Stationery",
    "Entertainment",
    "Security Services",
    "Construction",
    "Event Planning",
    "Technology",
    "Retail",
    "Finance",
    "Manufacturing",
    "Hospitality",
    "Professional Services",
    "Other",
  ];

  const businessTypes = [
    "Sole Proprietorship",
    "Partnership",
    "LLC",
    "Corporation",
    "Non-Profit",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
    if (!formData.categories) newErrors.categories = "Categories is required";
    if (!formData.businessType) newErrors.businessType = "Business type is required";
    if (!formData.description.trim()) newErrors.description = "Business description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const businessEmail = localStorage.getItem("businessEmail");
    if (!businessEmail) {
      toast.toast({
        variant: "destructive",
        title: "Unable to submit",
        description: "Please log in as a business before submitting a listing.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && id) {
        // Update existing business
        await businessAPI.update(id, {
          businessName: formData.businessName,
          categories: formData.categories,
          businessType: formData.businessType,
          website: formData.website,
          description: formData.description,
          image: formData.image,
          address: formData.address,
          phone: formData.phone,
        });

        toast.toast({
          title: "Business updated",
          description: "Your business listing has been updated successfully.",
        });
      } else {
        // Create new business
        await businessAPI.create({
          businessName: formData.businessName,
          categories: formData.categories,
          businessType: formData.businessType,
          website: formData.website,
          description: formData.description,
          image: formData.image,
          address: formData.address,
          phone: formData.phone,
          addedBy: businessEmail,
        });

        toast.toast({
          title: "Submitted for approval",
          description: "Your business was saved and is pending admin approval.",
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Business submission failed:", error);
      toast.toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Unable to submit business listing. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof FormData
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSelectChange = (value: string, field: keyof FormData) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {new URLSearchParams(window.location.search).get('id') ? "Edit Business" : "Add Your Business"}
          </h1>
          <p className="text-gray-600">
            {new URLSearchParams(window.location.search).get('id')
              ? "Update your business information"
              : "Create your business listing and get discovered by customers"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Fill in your business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name*</Label>
                  <Input
                    id="businessName"
                    placeholder="Enter business name"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange(e, "businessName")}
                    className={errors.businessName ? "border-red-500" : ""}
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="categories">Categories*</Label>
                  <Select
                    value={formData.categories}
                    onValueChange={(value) => handleSelectChange(value, "categories")}
                  >
                    <SelectTrigger className={errors.categories ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categories && (
                    <p className="text-red-500 text-sm mt-1">{errors.categories}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="businessType">Business Type*</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => handleSelectChange(value, "businessType")}
                  >
                    <SelectTrigger className={errors.businessType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.businessType && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Business Description*</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your business and what services you offer"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange(e, "description")}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter business address"
                    value={formData.address}
                    onChange={(e) => handleInputChange(e, "address")}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange(e, "phone")}
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange(e, "website")}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Business Image</Label>
                  <div className="mt-1">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-1 text-sm text-gray-600">Click to upload image</p>
                      </div>
                    </label>
                  </div>
                </div>


                <div className="flex items-start gap-3 pt-4">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, agreeTerms: e.target.checked })
                    }
                    className="mt-1"
                  />
                  <label htmlFor="agreeTerms" className="text-sm cursor-pointer">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!formData.agreeTerms}
                  className="w-full"
                >
                  {new URLSearchParams(window.location.search).get('id') ? "Update Business" : "Submit for Approval"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>How your business will appear to customers</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Business Card Preview */}
                <div className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden border mx-auto">
                  {/* Image Section */}
                  <div className="relative">
                    <img
                      src={
                        formData.image ||
                        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop"
                      }
                      alt="business preview"
                      className="w-full h-52 object-cover"
                    />

                    {/* Category Tag */}
                    <span className="absolute top-3 left-3 bg-white px-3 py-1 text-sm rounded-full shadow">
                      {formData.categories || "Business"}
                    </span>

                    {/* Wishlist Icon */}
                    <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
                      <Heart size={18} />
                    </button>

                    {/* Remove Image Button */}
                    {formData.image && (
                      <button
                        onClick={removeImage}
                        className="absolute top-3 right-14 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Title */}
                    <h2 className="text-xl font-semibold mb-2">
                      {formData.businessName || "Your Business Name"}
                    </h2>

                    {/* Rating */}
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Star className="text-yellow-500 mr-1" size={16} />
                      <span className="font-medium mr-1">4.5</span>
                      <span>(New)</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-sm mb-4">
                      {formData.description || "Your business description will appear here."}
                    </p>

                    {/* Address */}
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin size={16} className="mr-2" />
                      {formData.address || "Business Location"}
                    </div>

                    {/* Phone */}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Phone size={16} className="mr-2" />
                      {formData.phone || "Contact Info"}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <button className="flex items-center justify-center gap-2 w-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg">
                        <Mail size={16} />
                        Contact
                      </button>

                      <button className="flex items-center justify-center gap-2 w-1/2 border py-2 rounded-lg">
                        <Globe size={16} />
                        Visit
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBusinessForm;

