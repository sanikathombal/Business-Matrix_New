import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AddBusinessForm from "@/components/AddBusinessForm";

const AddBusiness = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Add New Business</h1>
            <p className="text-gray-600 mt-1">
              Create a new business listing. Submit for admin approval to make it visible to users.
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <AddBusinessForm />
      </div>
    </div>
  );
};

export default AddBusiness;
