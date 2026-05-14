import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { jobAPI } from "@/lib/api";

export default function BusinessMatrixDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobError, setJobError] = useState("");

  const pendingJobsCount = jobs.filter((job) => job.status !== "approved").length;
  const approvedJobsCount = jobs.filter((job) => job.status === "approved").length;

  const stats = [
    {
      title: 'Pending Vacancies',
      value: pendingJobsCount.toString(),
      icon: '🕒',
      bg: 'bg-orange-100',
    },
    {
      title: 'Approved Vacancies',
      value: approvedJobsCount.toString(),
      icon: '✅',
      bg: 'bg-green-100',
    },
    {
      title: 'Pending Businesses',
      value: '0',
      icon: '🏢',
      bg: 'bg-blue-100',
    },
    {
      title: 'Approved Businesses',
      value: '0',
      icon: '📊',
      bg: 'bg-purple-100',
    },
  ];

  const menuItems = [
    { label: 'Overview', href: '/dashboard/overview', icon: '🏠' },
    { label: 'Leads', href: '/leads', icon: '📈' },
    { label: 'Profile', href: '/profile', icon: '👤' },
    { label: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  const businessActions = [
    { label: 'Add Business', href: '/add-business' },
    { label: 'Add Job', href: '/add-job' },
    { label: 'Add Service', href: '/add-service' },
    { label: 'Admin Panel', href: '/admin/panel' },
  ];

  useEffect(() => {
    const loadJobs = async () => {
      const email = localStorage.getItem("businessEmail");
      if (!email) {
        setLoadingJobs(false);
        return;
      }

      try {
        const jobData = await jobAPI.getAll({ addedBy: email });
        setJobs(jobData || []);
      } catch (error) {
        console.error("Failed to load dashboard jobs:", error);
        setJobError("Unable to load recent vacancies right now.");
      } finally {
        setLoadingJobs(false);
      }
    };

    loadJobs();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
              B
            </div>
            <h1 className="ml-3 text-2xl font-bold text-indigo-600">
              BusinessMatrix
            </h1>
          </div>

          {/* Main Menu */}
          <div className="px-4 py-6">
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-medium ${
                    item.label === 'Overview'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Business Actions */}
            <div className="mt-10">
              <h2 className="text-xs uppercase tracking-widest text-gray-400 font-semibold px-3 mb-4">
                Business Actions
              </h2>

              <div className="space-y-2">
                {businessActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.href}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                      action.label === 'Add Business'
                        ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">
                      {action.label === 'Add Business' && '🏢'}
                      {action.label === 'Add Job' && '➕'}
                      {action.label === 'Add Service' && '👜'}
                      {action.label === 'Admin Panel' && '🛠️'}
                    </span>
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 pb-6">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-semibold transition-all duration-200">
            ↩ Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back to your business dashboard
            </p>
          </div>

          <div className="flex items-center gap-5">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-[280px] bg-[#f5f7fb] border border-gray-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
            </div>

            <Link
              to="/add-business"
              className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-indigo-500"
            >
              + Add Business
            </Link>

            {/* Notification */}
            <button className="relative text-xl">
              🔔
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
              S
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 overflow-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">
                      {card.title}
                    </h3>
                    <p className="text-5xl font-bold mt-4 text-gray-800">
                      {card.value}
                    </p>
                  </div>

                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${card.bg}`}
                  >
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Recent Vacancies */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm min-h-[300px]">
              <h3 className="text-2xl font-bold text-gray-800">
                Recent Vacancies
              </h3>

              <p className="text-gray-500 mt-2">
                Latest job postings from your business
              </p>

              {loadingJobs ? (
                <div className="mt-8 space-y-3">
                  <div className="h-4 w-3/4 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-4 w-1/2 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
                </div>
              ) : jobError ? (
                <div className="mt-16 flex items-center justify-center h-[120px] border-2 border-dashed border-gray-200 rounded-2xl bg-rose-50 text-rose-600">
                  {jobError}
                </div>
              ) : jobs.length === 0 ? (
                <div className="mt-16 flex items-center justify-center h-[120px] border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                  <p className="text-lg text-gray-400 font-medium">
                    No recent vacancies found.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid gap-4">
                  {jobs.slice(0, 3).map((job) => (
                    <div key={job.id || job._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">{job.title}</h4>
                          <p className="text-sm text-slate-500">{job.company}</p>
                        </div>
                        <Badge variant={job.status === 'approved' ? 'secondary' : 'outline'}>
                          {job.status || 'pending'}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm text-slate-600 line-clamp-2">{job.description || 'No description available.'}</p>
                      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                        <span>{job.location || 'Location not set'}</span>
                        <span>{job.salary ? `₹${job.salary}` : 'Salary not set'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Business Overview */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm min-h-[300px]">
              <h3 className="text-2xl font-bold text-gray-800">
                Business Overview
              </h3>

              <p className="text-gray-500 mt-2">
                Your business statistics and performance
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-600">Total Listings</span>
                  <span className="font-bold text-gray-800">0</span>
                </div>

                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-600">Active Listings</span>
                  <span className="font-bold text-gray-800">0</span>
                </div>

                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-600">Pending Approval</span>
                  <span className="font-bold text-gray-800">0</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-12">
                <div className="flex justify-between text-sm mb-2 text-gray-500">
                  <span>Business Completion</span>
                  <span>0%</span>
                </div>

                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="w-0 h-full bg-indigo-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Revenue Analytics
              </h4>

              <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                Analytics Chart Here
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                New Applications
              </h4>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Today</span>
                  <span className="font-bold">0</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-bold">0</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-bold">0</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h4>

              <div className="space-y-3">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-200">
                  Create New Job
                </button>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-200">
                  Add Business
                </button>

                <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold transition-all duration-200">
                  Manage Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

