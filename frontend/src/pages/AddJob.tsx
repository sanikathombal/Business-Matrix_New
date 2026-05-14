import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { jobAPI } from "@/lib/api";

interface FormData {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string;
}

const AddJob = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    company: localStorage.getItem("businessName") || "Your Business",
    location: "",
    salary: "",
    description: "",
    requirements: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing && id) {
      jobAPI.getById(id)
        .then((job) => {
          setFormData({
            title: job.title || "",
            company: job.company || "",
            location: job.location || "",
            salary: job.salary || "",
            description: job.description || "",
            requirements: job.requirements || "",
          });
        })
        .catch((error) => {
          console.error("Failed to load job for editing:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load job details for editing.",
          });
          navigate("/dashboard");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, navigate, toast]);

  const validateStep = (stepIndex: number) => {
    const newErrors: Record<string, string> = {};

    if (stepIndex === 1) {
      if (!formData.title.trim()) newErrors.title = "Job title is required";
      if (!formData.company.trim()) newErrors.company = "Company name is required";
      if (!formData.location.trim()) newErrors.location = "Location is required";
      if (!formData.salary.trim()) newErrors.salary = "Salary is required";
    }

    if (stepIndex === 2) {
      if (!formData.description.trim()) newErrors.description = "Job description is required";
      if (!formData.requirements.trim()) newErrors.requirements = "Requirements are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    const businessEmail = localStorage.getItem("businessEmail");
    
    if (!businessEmail) {
      toast({
        variant: 'destructive',
        title: 'Unable to submit',
        description: 'Please log in as a business before submitting a job.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const jobPayload = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        salary: formData.salary,
        description: formData.description,
        requirements: formData.requirements,
        addedBy: businessEmail,
        contactEmail: businessEmail,
        contactPhone: formData.requirements,
      };

      if (isEditing && id) {
        await jobAPI.update(id, jobPayload);
        toast({
          title: "Job updated",
          description: "Your job vacancy has been updated successfully.",
        });
      } else {
        const response = await jobAPI.create(jobPayload);
        
        if (!response) {
          throw new Error('No response from server');
        }

        toast({
          title: "Job submitted",
          description: "Your job vacancy has been submitted for admin approval.",
        });
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Job submission failed:", error);
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Unable to submit the job vacancy. Please try again.',
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

  return (
    <div className="min-h-screen bg-background">
      <section className="container py-16">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading job details...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">
                {isEditing ? "Edit Job Vacancy" : "Add Job Vacancy"}
              </h1>
              <p className="text-lg text-muted-foreground">
                {isEditing 
                  ? "Update your job listing details." 
                  : "Create a new job listing for your business."
                }
              </p>
            </div>

        <div className="w-full max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center flex-1">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold mb-2 ${
                      stepNumber < step
                        ? "bg-green-500 text-white"
                        : stepNumber === step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stepNumber < step ? <CheckCircle size={20} /> : stepNumber}
                  </div>
                  <span className="text-xs text-center text-muted-foreground">
                    {stepNumber === 1 && "Job Info"}
                    {stepNumber === 2 && "Description & Requirements"}
                    {stepNumber === 3 && "Confirm"}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "Job Information"}
                {step === 2 && "Description & Requirements"}
                {step === 3 && "Confirm Your Job Listing"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Provide basic information about the job position."}
                {step === 2 && "Describe the job and list the requirements."}
                {step === 3 && "Review and submit your job listing for approval."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Job Title*</Label>
                    <Input
                      id="title"
                      placeholder="Enter job title"
                      value={formData.title}
                      onChange={(e) => handleInputChange(e, "title")}
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="company">Company*</Label>
                    <Input
                      id="company"
                      placeholder="Enter company name"
                      value={formData.company}
                      onChange={(e) => handleInputChange(e, "company")}
                      className={errors.company ? "border-red-500" : ""}
                    />
                    {errors.company && (
                      <p className="text-red-500 text-sm mt-1">{errors.company}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="location">Location*</Label>
                    <Input
                      id="location"
                      placeholder="Enter job location"
                      value={formData.location}
                      onChange={(e) => handleInputChange(e, "location")}
                      className={errors.location ? "border-red-500" : ""}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="salary">Salary*</Label>
                    <Input
                      id="salary"
                      placeholder="Enter salary range"
                      value={formData.salary}
                      onChange={(e) => handleInputChange(e, "salary")}
                      className={errors.salary ? "border-red-500" : ""}
                    />
                    {errors.salary && (
                      <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Job Description*</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the job responsibilities and what the role entails"
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
                    <Label htmlFor="requirements">Requirements*</Label>
                    <Textarea
                      id="requirements"
                      placeholder="List the skills, experience, and qualifications required"
                      rows={4}
                      value={formData.requirements}
                      onChange={(e) => handleInputChange(e, "requirements")}
                      className={errors.requirements ? "border-red-500" : ""}
                    />
                    {errors.requirements && (
                      <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please review your job details before submitting for approval.
                    </AlertDescription>
                  </Alert>

                  <div className="bg-muted p-4 rounded-lg space-y-3 max-h-96 overflow-y-auto">
                    <div>
                      <p className="text-sm text-muted-foreground">Job Title</p>
                      <p className="font-semibold">{formData.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-semibold">{formData.company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{formData.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Salary</p>
                      <p className="font-semibold">{formData.salary}</p>
                    </div>
                    <hr className="my-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Job Description</p>
                      <p className="font-semibold">{formData.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Requirements</p>
                      <p className="font-semibold">{formData.requirements}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-3 mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Back
                </Button>

                {step < 3 ? (
                  <Button onClick={handleNext} className="flex items-center gap-2">
                    Next <ArrowRight size={16} />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle size={16} /> {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
        </>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default AddJob;
