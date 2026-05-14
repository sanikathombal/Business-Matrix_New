import Navbar from "@/components/Navbar";
import BusinessRegistrationForm from "@/components/BusinessRegistrationForm";

const BusinessRegistration = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="container py-12">
        {/* <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Register Your Business</h1>
          <p className="text-lg text-muted-foreground">
            Join thousands of businesses growing with BusinessMatrix. Get started in just a few steps.
          </p>
        </div> */}
        
        <BusinessRegistrationForm />
      </section>

      
    </div>
  );
};

export default BusinessRegistration;
