import Navbar from "@/components/Navbar";
import UserLoginForm from "@/components/UserLoginForm";

const UserLogin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="container py-8">
        <div className="flex items-center justify-center py-4">
          <UserLoginForm />
        </div>
      </section>
    </div>
  );
};

export default UserLogin;
