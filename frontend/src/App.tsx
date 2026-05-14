import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BusinessRegistration from "./pages/BusinessRegistration";
import BusinessLogin from "./pages/BusinessLogin";
import UserLogin from "./pages/UserLogin";
import UserRegistration from "./pages/UserRegistration";
import UserDashboard from "./pages/UserDashboard";
import BusinessRequirements from "./pages/BusinessRequirements";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AddJob from "./pages/AddJob";
import AddService from "./pages/AddService";
import AdminManage from "./pages/AdminManage";
import CategoryBusinesses from "./pages/CategoryBusinesses";
import AddBusiness from "./pages/AddBusiness";
import CreateBusinessProfile from "./pages/CreateBusinessProfile";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import BusinessOverview from "./pages/BusinessOverview";
import Categories from "./pages/Categories";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login-user" element={<UserLogin />} />
          <Route path="/register-user" element={<UserRegistration />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/register-business" element={<BusinessRegistration />} />
          <Route path="/add-business" element={<AddBusiness />} />
          <Route path="/create-business-profile" element={<CreateBusinessProfile />} />
          <Route path="/business-login" element={<BusinessLogin />} />
          <Route path="/business-requirements" element={<BusinessRequirements />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/overview" element={<BusinessOverview />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add-job" element={<AddJob />} />
          <Route path="/edit-business/:id" element={<AddBusiness />} />
          <Route path="/edit-job/:id" element={<AddJob />} />
          <Route path="/add-service" element={<AddService />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/panel" element={<AdminPanel />} />
          <Route path="/admin/manage" element={<AdminManage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:categoryName" element={<CategoryBusinesses />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
