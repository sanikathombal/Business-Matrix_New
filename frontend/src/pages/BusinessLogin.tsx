import Navbar from "@/components/Navbar";
import BusinessLoginForm from "@/components/BusinessLoginForm";
import Footer from "@/components/Footer";

const BusinessLogin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="container py-4">
        <div className="flex items-center justify-center">
          <BusinessLoginForm />
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default BusinessLogin;
