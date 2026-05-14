import Navbar from "@/components/Navbar";
import UserRegistrationForm from "@/components/UserRegistrationForm";

const UserRegistration = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="container py-8">
        <div className="flex items-center justify-center">
          <UserRegistrationForm />
        </div>
      </section>
    </div>
  );
};

export default UserRegistration;
