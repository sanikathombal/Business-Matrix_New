import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, Building, Settings, LogOut, Briefcase, Wrench, BarChart3, FileText, Bell, Database } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { businessAPI, jobAPI } from "@/lib/api";

const AdminPanel = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [approvedVacanciesCount, setApprovedVacanciesCount] = useState(0);

  const loadBusinesses = async () => {
    try {
      const pending = await businessAPI.getAll({ status: 'pending' });
      const approved = await businessAPI.getAll({ status: 'approved' });
      setBusinesses(pending);
      setApprovedCount(approved.length);
    } catch (error) {
      console.error('Unable to load business approvals:', error);
      setBusinesses([]);
      setApprovedCount(0);
      toast.toast({
        variant: 'destructive',
        title: 'Unable to fetch business approvals',
        description: 'Check the backend connection and try again.',
      });
    }
  };

  const loadVacancies = async () => {
    try {
      const pendingVacancies = await jobAPI.getAll({ status: 'pending' });
      const approvedVacancies = await jobAPI.getAll({ status: 'approved' });
      setVacancies(pendingVacancies);
      setApprovedVacanciesCount(approvedVacancies.length);
    } catch (error) {
      console.error('Unable to load vacancy approvals:', error);
      setVacancies([]);
      setApprovedVacanciesCount(0);
      toast.toast({
        variant: 'destructive',
        title: 'Unable to fetch vacancies',
        description: 'Check the backend connection and try again.',
      });
    }
  };

  useEffect(() => {
    // Check admin authentication
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      navigate("/admin/login");
      return;
    }

    loadBusinesses();
    loadVacancies();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  const approveBusiness = async (id: string) => {
    try {
      await businessAPI.approve(id);
      await loadBusinesses();
      toast.toast({
        title: "Business approved",
        description: "The business is now listed on the platform.",
      });
    } catch (error) {
      console.error('Business approval failed:', error);
      toast.toast({
        variant: 'destructive',
        title: 'Approval failed',
        description: 'Unable to approve the business. Please try again.',
      });
    }
  };

  const approveVacancy = async (id: string) => {
    try {
      await jobAPI.approve(id);
      await loadVacancies();
      toast.toast({
        title: "Vacancy approved",
        description: "The job vacancy is now visible to users.",
      });
    } catch (error) {
      console.error('Vacancy approval failed:', error);
      toast.toast({
        variant: 'destructive',
        title: 'Approval failed',
        description: 'Unable to approve the vacancy. Please try again.',
      });
    }
  };

  const rejectVacancy = async (id: string) => {
    try {
      await jobAPI.delete(id);
      await loadVacancies();
      toast.toast({
        title: "Vacancy rejected",
        description: "The job vacancy has been removed.",
      });
    } catch (error) {
      console.error('Vacancy rejection failed:', error);
      toast.toast({
        variant: 'destructive',
        title: 'Rejection failed',
        description: 'Unable to remove the vacancy. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50 text-slate-900">
      <section className="container py-16">
        <div className="rounded-3xl bg-white shadow-xl ring-1 ring-slate-200/60 p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="mt-2 max-w-xl text-base text-slate-600">
                Overview and quick actions for managing users, businesses, system settings, and security.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard">
                <Button className="h-11" size="sm">
                  Go to User Dashboard
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="h-11" size="sm">
                  Back to Home
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="h-11"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-medium text-slate-700">Active Users</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {JSON.parse(localStorage.getItem("userLoggedIn") === "true" ? "1" : "0")}
              </p>
              <p className="mt-2 text-xs text-slate-500">Currently logged in</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-medium text-slate-700">Pending Approvals</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {businesses.length + vacancies.length}
              </p>
              <p className="mt-2 text-xs text-slate-500">Businesses & Job Listings</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-medium text-slate-700">Approved Businesses</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {approvedCount}
              </p>
              <p className="mt-2 text-xs text-slate-500">Active on platform</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-medium text-slate-700">Live Job Postings</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {approvedVacanciesCount}
              </p>
              <p className="mt-2 text-xs text-slate-500">Visible to users</p>
            </div>
          </div>
        </div>

        <div id="admin-business-approvals" className="mt-10 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Pending Business Approvals</h2>
              <p className="mt-1 text-sm text-slate-600">
                Approve new businesses before they appear on the marketplace.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              {businesses.length} pending
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-slate-900">{business.businessName}</p>
                  <p className="text-sm text-slate-600">{business.industry}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      business.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {business.status === "approved" ? "Approved" : "Pending"}
                  </span>
                  <Button
                    size="sm"
                    variant={business.status === "approved" ? "outline" : "secondary"}
                    onClick={() => approveBusiness(business.id)}
                    disabled={business.status === "approved"}
                  >
                    {business.status === "approved" ? "Approved" : "Approve"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="admin-vacancy-approvals" className="mt-10 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Pending Vacancy Approvals</h2>
              <p className="mt-1 text-sm text-slate-600">
                Review and approve job vacancies submitted by businesses.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              {vacancies.length} pending
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {vacancies.map((vacancy) => (
              <div
                key={vacancy.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-slate-900">{vacancy.title}</p>
                  <p className="text-sm text-slate-600">{vacancy.company} ({vacancy.businessEmail}) - {vacancy.location}</p>
                  <p className="text-xs text-slate-500">Salary: {vacancy.salary}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => approveVacancy(vacancy.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectVacancy(vacancy.id)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
            {vacancies.length === 0 && (
              <p className="text-center text-slate-500 py-4">No pending vacancies</p>
            )}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 hover:bg-slate-50 transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Users</h3>
                <p className="mt-1 text-sm text-slate-600">
                  View and manage registered users.
                </p>
              </div>
              <Users className="h-6 w-6 text-emerald-500" />
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Review user accounts, roles, and activity in one place.
            </p>
            <Button variant="secondary" className="mt-6 w-full">
              Manage Users
            </Button>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 hover:bg-slate-50 transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Businesses</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Review and approve submitted businesses.
                </p>
              </div>
              <Building className="h-6 w-6 text-indigo-500" />
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Edit listings, change statuses, and manage categories.
            </p>
            <Button
              variant="secondary"
              className="mt-6 w-full"
              onClick={() => navigate("/admin/manage")}
            >
              Manage Businesses
            </Button>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 hover:bg-slate-50 transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Security</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Manage access and enforce policies.
                </p>
              </div>
              <ShieldCheck className="h-6 w-6 text-rose-500" />
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Review logs, update credentials, and manage access.
            </p>
            <Button variant="secondary" className="mt-6 w-full">
              View Security Logs
            </Button>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 hover:bg-slate-50 transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">System</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Configure settings and monitor platform health.
                </p>
              </div>
              <Settings className="h-6 w-6 text-cyan-500" />
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Update platform settings, notification preferences, and more.
            </p>
            <Button variant="secondary" className="mt-6 w-full">
              System Settings
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Platform Management</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Job Listings</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Manage all job postings and vacancies.
                  </p>
                </div>
                <Briefcase className="h-6 w-6 text-blue-500" />
              </div>
              <p className="mt-4 text-sm text-slate-600">
                View approved jobs, manage categories, and handle job-related content.
              </p>
              <Button variant="secondary" className="mt-6 w-full">
                Manage Jobs
              </Button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Services</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Oversee service listings and categories.
                  </p>
                </div>
                <Wrench className="h-6 w-6 text-purple-500" />
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Review service providers, manage service categories, and quality control.
              </p>
              <Button variant="secondary" className="mt-6 w-full">
                Manage Services
              </Button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Analytics</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    View platform statistics and insights.
                  </p>
                </div>
                <BarChart3 className="h-6 w-6 text-green-500" />
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Monitor user engagement, business performance, and platform growth metrics.
              </p>
              <Button variant="secondary" className="mt-6 w-full">
                View Analytics
              </Button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Content Moderation</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Review and moderate user-generated content.
                  </p>
                </div>
                <FileText className="h-6 w-6 text-orange-500" />
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Monitor reviews, comments, and ensure content quality and compliance.
              </p>
              <Button variant="secondary" className="mt-6 w-full">
                Moderate Content
              </Button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Send announcements and manage communications.
                  </p>
                </div>
                <Bell className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Broadcast important updates, maintenance notices, and platform news.
              </p>
              <Button variant="secondary" className="mt-6 w-full">
                Send Notifications
              </Button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Backup & Recovery</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Manage data backups and system recovery.
                  </p>
                </div>
                <Database className="h-6 w-6 text-red-500" />
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Schedule backups, monitor data integrity, and handle recovery operations.
              </p>
              <Button variant="secondary" className="mt-6 w-full">
                Manage Backups
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminPanel;
