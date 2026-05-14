import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { businessAPI, jobAPI } from "@/lib/api";
import { MapPin, Star, Phone, Mail, Globe, Briefcase, Wrench, Tag, Trash2 } from "lucide-react";

const AdminManage = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSection, setSelectedSection] = useState<'businesses' | 'jobs' | 'services' | 'coupons'>('businesses');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [allBusinesses, allJobs] = await Promise.all([
          businessAPI.getAll(),
          jobAPI.getAll(),
        ]);
        setBusinesses(allBusinesses || []);
        setJobs(allJobs || []);
      } catch (err) {
        console.error("Failed to load admin data:", err);
        setError("Unable to load admin data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  return (
    <div className="min-h-screen bg-background">
      <section className="container py-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Admin Management</h1>
            <p className="text-lg text-muted-foreground mt-2">
              See all businesses, jobs, services, and coupons in a clean, user-friendly view.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => navigate("/admin/panel")}>Back to Admin Panel</Button>
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-10 shadow-lg ring-1 ring-slate-200">
            <p className="text-slate-600">Loading admin data…</p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl bg-rose-50 border border-rose-200 p-6 mb-8">
            <p className="text-rose-700">{error}</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Manage Sections</h2>
              <p className="text-sm text-slate-500 mt-1">Click a section to view its cards.</p>
            </div>
            <div className="space-y-3">
              <Button
                variant={selectedSection === 'businesses' ? 'secondary' : 'outline'}
                className="w-full justify-start text-left"
                onClick={() => setSelectedSection('businesses')}
              >
                All Businesses
              </Button>
              <Button
                variant={selectedSection === 'jobs' ? 'secondary' : 'outline'}
                className="w-full justify-start text-left"
                onClick={() => setSelectedSection('jobs')}
              >
                Job Vacancies
              </Button>
              <Button
                variant={selectedSection === 'services' ? 'secondary' : 'outline'}
                className="w-full justify-start text-left"
                onClick={() => setSelectedSection('services')}
              >
                All Services
              </Button>
              <Button
                variant={selectedSection === 'coupons' ? 'secondary' : 'outline'}
                className="w-full justify-start text-left"
                onClick={() => setSelectedSection('coupons')}
              >
                All Coupons
              </Button>
            </div>
          </aside>

          <main className="space-y-12">
            {/* BUSINESSES */}
            {selectedSection === 'businesses' && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">All Businesses</h2>
                    <p className="text-slate-500">Showing {businesses.length} businesses</p>
                  </div>
                </div>
                {businesses.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 p-8 text-center">
                    <p className="text-slate-500">No businesses found.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {businesses.map((business) => (
                      <Card key={business.id || business._id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200">
                        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden">
                          {business.image ? (
                            <img src={business.image} alt={business.businessName} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-5xl mb-2">🏢</div>
                                <p className="text-sm font-medium text-slate-600">{business.businessType || "Business"}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <CardTitle className="line-clamp-2">{business.businessName || "Business"}</CardTitle>
                            <Badge variant={business.status === "approved" ? "secondary" : "outline"}>
                              {business.status || "pending"}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500 mb-3">{business.industry || "Industry not set"}</p>
                          <p className="text-sm text-slate-600 line-clamp-3 mb-4">{business.description || "No description available."}</p>
                          <div className="space-y-2 text-sm text-slate-600">
                            {business.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <span className="truncate">{business.phone}</span>
                              </div>
                            )}
                            {business.city && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                <span>{business.city}, {business.state || ""}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-4 flex justify-end">
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* JOBS */}
            {selectedSection === 'jobs' && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <Briefcase className="h-8 w-8 text-green-600" />
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Job Vacancies</h2>
                    <p className="text-slate-500">Showing {jobs.length} job postings</p>
                  </div>
                </div>
                {jobs.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 p-8 text-center">
                    <p className="text-slate-500">No jobs found.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                      <Card key={job.id || job._id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200">
                        <div className="relative h-40 bg-gradient-to-br from-emerald-100 to-emerald-50 overflow-hidden">
                          {job.image ? (
                            <img src={job.image} alt={job.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-emerald-100 to-emerald-50"></div>
                          )}
                        </div>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <CardTitle className="line-clamp-2">{job.title}</CardTitle>
                              <p className="text-sm text-slate-500 mt-1">{job.company}</p>
                            </div>
                            <Badge variant={job.status === "approved" ? "secondary" : "outline"}>
                              {job.status || "pending"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span>{job.location}</span>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-3 mb-4">{job.description || "No description provided."}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <span className="text-sm font-semibold text-slate-900">{job.salary || "Salary TBD"}</span>
                            <span className="text-xs text-slate-500">{job.posted || "Recently"}</span>
                          </div>
                          <div className="mt-4 flex justify-end">
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
              </div>
            )}

            {/* SERVICES */}
            {selectedSection === 'services' && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <Wrench className="h-8 w-8 text-purple-600" />
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">All Services</h2>
                    <p className="text-slate-500">Showing {services.length} services</p>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <Card key={service.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200">
                      <div className="relative h-40 bg-gradient-to-br from-purple-100 to-purple-50 overflow-hidden">
                        {service.image ? (
                          <img src={service.image} alt={service.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-purple-100 to-purple-50"></div>
                        )}
                      </div>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <CardTitle className="line-clamp-2">{service.name}</CardTitle>
                            <p className="text-sm text-slate-500 mt-1">{service.provider}</p>
                          </div>
                          <Badge variant="outline">{service.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-500 mb-3">{service.category}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <span className="text-sm font-semibold text-slate-900">{service.price}</span>
                        </div>
                        <div className="mt-4 flex justify-end">
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* COUPONS */}
            {selectedSection === 'coupons' && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <Tag className="h-8 w-8 text-orange-600" />
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">All Coupons</h2>
                    <p className="text-slate-500">Showing {coupons.length} coupons</p>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {coupons.map((coupon) => (
                    <Card key={coupon.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200">
                      <div className="relative h-40 bg-gradient-to-br from-orange-100 to-orange-50 overflow-hidden">
                        {coupon.image ? (
                          <img src={coupon.image} alt={coupon.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                            <span className="text-5xl font-bold text-orange-200">{coupon.discount}</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="pt-6">
                        <div className="mb-2">
                          <CardTitle className="line-clamp-2">{coupon.title}</CardTitle>
                          <p className="text-sm text-slate-500 mt-1">{coupon.business}</p>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">Valid until {coupon.validUntil}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <span className="text-sm font-mono font-bold text-slate-900">{coupon.code}</span>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="secondary" className="text-xs">Copy</Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="gap-2"
                              onClick={() => handleDeleteCoupon(coupon.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>      </section>
    </div>
  );
};

export default AdminManage;
