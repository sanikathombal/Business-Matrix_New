import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="container py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-lg text-muted-foreground">
            Configure your account, notifications, and platform preferences.
          </p>
        </div>

        <div className="rounded-lg bg-card border border-border p-8 shadow-sm">
          <p className="text-sm text-muted-foreground">
            (This is a placeholder page. Add your settings UI here.)
          </p>
        </div>

        <div className="mt-8">
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Settings;
