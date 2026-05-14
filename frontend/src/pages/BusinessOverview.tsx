import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { businessAPI, jobAPI } from "@/lib/api";
import { Briefcase, ClipboardList, Wrench, Tag, MapPin, Users, Trash2, Edit } from "lucide-react";

const BusinessOverview = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [businessEmail, setBusinessEmail] = useState<string | null>(null);

  const [services, setServices] = useState<any[]>([
    {
      id: "service-1",
      name: "Premium Cleaning",
      provider: "Sparkle Home Services",
      category: "Home Services",
      price: "₹1,999",
      status: "Active",
      image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop",
    },
    {
      id: "service-2",
      name: "Website Design",
      provider: "Digital Growth Studio",
      category: "Business Services",
      price: "₹5,499",
      status: "Active",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    },
    {
      id: "service-3",
      name: "Legal Consultation",
      provider: "LawCare Advisors",
      category: "Professional Services",
      price: "₹999",
      status: "Active",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    },
  ]);

  const [coupons, setCoupons] = useState<any[]>([
    {
      id: "coupon-1",
      title: "Summer Sale 20% Off",
      business: "Sparkle Home Services",
      discount: "20%",
      validUntil: "30 Jun 2026",
      code: "SUMMER20",
      image: "https://images.unsplash.com/photo-1609269585253-05a526f8e052?w=400&h=300&fit=crop",
    },
    {
      id: "coupon-2",
      title: "Startup Boost",
      business: "Digital Growth Studio",
      discount: "15%",
      validUntil: "15 Jul 2026",
      code: "BOOST15",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    },
    {
      id: "coupon-3",
      title: "Legal First Consult",
      business: "LawCare Advisors",
      discount: "10%",
      validUntil: "31 Aug 2026",
      code: "LAW10",
      image: "https://images.unsplash.com/photo-1589829545856-d3d2c2a5a1be?w=400&h=300&fit=crop",
    },
  ]);

  // Edit modal states
  const [editingService, setEditingService] = useState<any>(null);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [serviceForm, setServiceForm] = useState({ name: "", provider: "", category: "", price: "", image: "" });
  const [couponForm, setCouponForm] = useState({ title: "", business: "", discount: "", validUntil: "", code: "", image: "" });

  useEffect(() => {
    const email = localStorage.getItem("businessEmail");
    if (!email) {
      setError("Please log in to view your business overview.");
      setLoading(false);
      return;
    }

    setBusinessEmail(email);

    const loadOverview = async () => {
      setLoading(true);
      try {
        const [businessData, jobData] = await Promise.all([
          businessAPI.getAll({ addedBy: email }),
          jobAPI.getAll({ addedBy: email }),
        ]);
        setBusinesses(businessData || []);
        setJobs(jobData || []);
      } catch (err) {
        console.error("Failed to load business overview:", err);
        setError("Unable to load your business overview. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  const handleDeleteBusiness = async (businessId: string) => {
    const confirmed = window.confirm("Delete this business? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await businessAPI.delete(businessId);
      setBusinesses((prev) => prev.filter((business) => (business.id || business._id) !== businessId));
    } catch (err) {
      console.error("Failed to delete business:", err);
      setError("Unable to delete the business. Please try again.");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    const confirmed = window.confirm("Delete this job posting? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await jobAPI.delete(jobId);
      setJobs((prev) => prev.filter((job) => (job.id || job._id) !== jobId));
    } catch (err) {
      console.error("Failed to delete job:", err);
      setError("Unable to delete the job posting. Please try again.");
    }
  };

  const handleDeleteService = (serviceId: string) => {
    const confirmed = window.confirm("Delete this service? This action cannot be undone.");
    if (!confirmed) return;
    setServices((prev) => prev.filter((service) => service.id !== serviceId));
  };

  const handleDeleteCoupon = (couponId: string) => {
    const confirmed = window.confirm("Delete this coupon? This action cannot be undone.");
    if (!confirmed) return;
    setCoupons((prev) => prev.filter((coupon) => coupon.id !== couponId));
  };

  const handleEditBusiness = (business: any) => {
    // Navigate to edit business page with business data
    window.location.href = `/edit-business/${business.id || business._id}`;
  };

  const handleEditJob = (job: any) => {
    // Navigate to edit job page with job data
    window.location.href = `/edit-job/${job.id || job._id}`;
  };

  const handleEditService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setEditingService(service);
      setServiceForm({
        name: service.name,
        provider: service.provider,
        category: service.category,
        price: service.price,
        image: service.image,
      });
    }
  };

  const handleEditCoupon = (couponId: string) => {
    const coupon = coupons.find(c => c.id === couponId);
    if (coupon) {
      setEditingCoupon(coupon);
      setCouponForm({
        title: coupon.title,
        business: coupon.business,
        discount: coupon.discount,
        validUntil: coupon.validUntil,
        code: coupon.code,
        image: coupon.image,
      });
    }
  };

  const handleSaveService = () => {
    if (editingService) {
      setServices(prev => prev.map(s => 
        s.id === editingService.id 
          ? { ...s, ...serviceForm }
          : s
      ));
      setEditingService(null);
      setServiceForm({ name: "", provider: "", category: "", price: "", image: "" });
    }
  };

  const handleSaveCoupon = () => {
    if (editingCoupon) {
      setCoupons(prev => prev.map(c => 
        c.id === editingCoupon.id 
          ? { ...c, ...couponForm }
          : c
      ));
      setEditingCoupon(null);
      setCouponForm({ title: "", business: "", discount: "", validUntil: "", code: "", image: "" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="container py-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Business Overview</h1>
            <p className="text-lg text-muted-foreground mt-2">
              See your business listings, jobs, services, and coupons in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Link to="/dashboard" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              ← Back to Dashboard
            </Link>
            <Button variant="secondary" asChild>
              <Link to="/add-job">Post a Job</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/add-service">Add Service</Link>
            </Button>
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-10 shadow-lg ring-1 ring-slate-200">
            <p className="text-slate-600">Loading your overview…</p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl bg-rose-50 border border-rose-200 p-6 mb-8">
            <p className="text-rose-700">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-10">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">My Businesses</p>
                    <p className="text-4xl font-bold text-slate-900 mt-4">{businesses.length}</p>
                  </div>
                  <Briefcase className="h-10 w-10 text-indigo-600" />
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Jobs Posted</p>
                    <p className="text-4xl font-bold text-slate-900 mt-4">{jobs.length}</p>
                  </div>
                  <ClipboardList className="h-10 w-10 text-emerald-600" />
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Services</p>
                    <p className="text-4xl font-bold text-slate-900 mt-4">{services.length}</p>
                  </div>
                  <Wrench className="h-10 w-10 text-purple-600" />
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Coupons</p>
                    <p className="text-4xl font-bold text-slate-900 mt-4">{coupons.length}</p>
                  </div>
                  <Tag className="h-10 w-10 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Your Businesses</h2>
                    <p className="text-sm text-slate-500 mt-1">All businesses you have added with this account.</p>
                  </div>
                </div>
                {businesses.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
                    No businesses found yet.
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {businesses.map((business) => (
                      <Card key={business.id || business._id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-0">
                          <div className="relative h-40 overflow-hidden bg-indigo-50">
                            <img 
                              src={business.image || business.logo || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"} 
                              alt={business.businessName || "Business"} 
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <div className="p-6">
                            <div className="mb-3 flex items-center gap-3">
                              <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                                <Briefcase className="h-5 w-5" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{business.businessName || "Business"}</CardTitle>
                                <p className="text-sm text-slate-500">{business.industry || business.businessType || "No category"}</p>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-3 mb-4">{business.description || "No description provided."}</p>
                            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                              {business.city && <span>{business.city}</span>}
                              {business.state && <span>{business.state}</span>}
                              {business.phone && <span>{business.phone}</span>}
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                                onClick={() => handleEditBusiness(business)}
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="gap-2"
                                onClick={() => handleDeleteBusiness(business.id || business._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Your Job Postings</h2>
                    <p className="text-sm text-slate-500 mt-1">Job vacancies added by your business.</p>
                  </div>
                </div>
                {jobs.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
                    No jobs posted yet.
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                      <Card key={job.id || job._id} className="border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                              <ClipboardList className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{job.title || "Job"}</CardTitle>
                              <p className="text-sm text-slate-500">{job.company || "Company"}</p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-3 mb-4">{job.description || "No description available."}</p>
                          <div className="flex items-center justify-between text-sm text-slate-500">
                            <span>{job.location || "Location not set"}</span>
                            <Badge variant={job.status === "approved" ? "secondary" : "outline"}>{job.status || "pending"}</Badge>
                          </div>
                          <div className="mt-4 flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2"
                              onClick={() => handleEditJob(job)}
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="gap-2"
                              onClick={() => handleDeleteJob(job.id || job._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Your Services</h2>
                    <p className="text-sm text-slate-500 mt-1">Service items associated with your business.</p>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <Card key={service.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="relative h-40 overflow-hidden bg-purple-50">
                          <img src={service.image} alt={service.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="p-6">
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <p className="text-sm text-slate-500 mt-1">{service.provider}</p>
                          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                            <span>{service.category}</span>
                            <span className="font-semibold">{service.price}</span>
                          </div>
                          <div className="mt-4 flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2"
                                  onClick={() => handleEditService(service.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Service</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="service-name" className="text-right">
                                      Name
                                    </Label>
                                    <Input
                                      id="service-name"
                                      value={serviceForm.name}
                                      onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="service-provider" className="text-right">
                                      Provider
                                    </Label>
                                    <Input
                                      id="service-provider"
                                      value={serviceForm.provider}
                                      onChange={(e) => setServiceForm(prev => ({ ...prev, provider: e.target.value }))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="service-category" className="text-right">
                                      Category
                                    </Label>
                                    <Input
                                      id="service-category"
                                      value={serviceForm.category}
                                      onChange={(e) => setServiceForm(prev => ({ ...prev, category: e.target.value }))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="service-price" className="text-right">
                                      Price
                                    </Label>
                                    <Input
                                      id="service-price"
                                      value={serviceForm.price}
                                      onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="service-image" className="text-right">
                                      Image URL
                                    </Label>
                                    <Input
                                      id="service-image"
                                      value={serviceForm.image}
                                      onChange={(e) => setServiceForm(prev => ({ ...prev, image: e.target.value }))}
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setEditingService(null)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleSaveService}>
                                    Save Changes
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="gap-2"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Your Coupons</h2>
                    <p className="text-sm text-slate-500 mt-1">Discount offers you can share with customers.</p>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {coupons.map((coupon) => (
                    <Card key={coupon.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="relative h-40 overflow-hidden bg-orange-50">
                          <img src={coupon.image} alt={coupon.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="p-6">
                          <CardTitle className="text-lg">{coupon.title}</CardTitle>
                          <p className="text-sm text-slate-500 mt-1">{coupon.business}</p>
                          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                            <span>Valid until {coupon.validUntil}</span>
                            <Badge variant="secondary">{coupon.discount}</Badge>
                          </div>
                          <p className="mt-3 text-xs text-slate-500">Code: {coupon.code}</p>
                          <div className="mt-4 flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2"
                                  onClick={() => handleEditCoupon(coupon.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Coupon</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="coupon-title" className="text-right">
                                      Title
                                    </Label>
                                    <Input
                                      id="coupon-title"
                                      value={couponForm.title}
                                      onChange={(e) => setCouponForm(prev => ({ ...prev, title: e.target.value }))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="coupon-business" className="text-right">
                                      Business
                                    </Label>
                                    <Input
                                      id="coupon-business"
                                      value={couponForm.business}
                                      onChange={(e) => setCouponForm(prev => ({ ...prev, business: e.target.value }))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="coupon-discount" className="text-right">
                                      Discount
                                    </Label>
                                    <Input
                                      id="coupon-discount"
                                      value={couponForm.discount}
                                      onChange={(e) => setCouponForm(prev => ({ ...prev, discount: e.target.value }))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="coupon-validUntil" className="text-right">
                                      Valid Until
                                    </Label>
                                    <Input
                                      id="coupon-validUntil"
                                      value={couponForm.validUntil}
                                      onChange={(e) => setCouponForm(prev => ({ ...prev, validUntil: e.target.value }))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="coupon-code" className="text-right">
                                      Code
                                    </Label>
                                    <Input
                                      id="coupon-code"
                                      value={couponForm.code}
                                      onChange={(e) => setCouponForm(prev => ({ ...prev, code: e.target.value }))}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="coupon-image" className="text-right">
                                      Image URL
                                    </Label>
                                    <Input
                                      id="coupon-image"
                                      value={couponForm.image}
                                      onChange={(e) => setCouponForm(prev => ({ ...prev, image: e.target.value }))}
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setEditingCoupon(null)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleSaveCoupon}>
                                    Save Changes
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="gap-2"
                              onClick={() => handleDeleteCoupon(coupon.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default BusinessOverview;
