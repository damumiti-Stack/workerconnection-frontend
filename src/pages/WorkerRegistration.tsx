// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useLanguage } from "../contexts/LanguageContext";
// import Stepper from "../components/Stepper";
// import IdentityVerification from "../components/worker-registration/IdentityVerification";
// import PersonalInformation from "../components/worker-registration/PersonalInformation";
// import WorkplaceDetails from "../components/worker-registration/WorkplaceDetails";
// import AddressDetails from "../components/worker-registration/AddressDetails";
// import BankDetails from "../components/worker-registration/BankDetails";
// import OtherDetails from "../components/worker-registration/OtherDetails";
// import DocumentUpload from "../components/worker-registration/DocumentUpload";
// import ReviewSubmit from "../components/worker-registration/ReviewSubmit";

// const WorkerRegistration: React.FC = () => {
//   const { t } = useLanguage();
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//     // Identity
//     aadharNumber: "",
//     otp: "",
//     isOtpVerified: false,
//     eSharmId: "",
//     boCWId: "",

//     // Personal Info
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     gender: "",
//     dateOfBirth: "",
//     age: "",
//     maritalStatus: "",
//     fatherHusbandName: "",
//     caste: "",
//     subCaste: "",
//     dependents: [],

//     // Workplace
//     employerName: "",
//     constructionOrg: "",
//     tradeOfWork: "",
//     workerCategory: "",

//     // Address
//     presentAddress: {
//       doorNumber: "",
//       street: "",
//       district: "",
//       mandal: "",
//       village: "",
//       pincode: "",
//     },
//     permanentAddress: {
//       doorNumber: "",
//       street: "",
//       district: "",
//       mandal: "",
//       village: "",
//       pincode: "",
//     },
//     sameAsPresent: false,

//     // Bank Details
//     accountNumber: "",
//     confirmAccountNumber: "",
//     bankName: "",
//     ifscCode: "",
//     branchName: "",
//     branchAddress: "",

//     // Other Details
//     isNresWorker: "",
//     isTradeUnionMember: "",
//     tradeUnionNumber: "",

//     // Documents
//     documents: {
//       passportPhoto: null,
//       aadharCard: null,
//       checkPassbook: null,
//       nresDocument: null,
//     },
//   });

//   const steps = [
//     { id: 1, title: "Identity", completed: currentStep > 1 },
//     { id: 2, title: "Personal", completed: currentStep > 2 },
//     // { id: 3, title: "Workplace", completed: currentStep > 3 },
//     { id: 3, title: "Address", completed: currentStep > 3 },
//     // { id: 4, title: "Bank", completed: currentStep > 4 },
//     { id: 4, title: "Other", completed: currentStep > 4 },
//     // { id: 5, title: "Documents", completed: currentStep > 5 },
//     { id: 5, title: "Review", completed: false },
//   ];

//   const handleNext = () => {
//     if (currentStep < 5) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleSubmit = () => {
//     // Process form submission
//     console.log("Form submitted:", formData);
//     alert("Registration submitted successfully!");
//     navigate("/");
//   };

//   const renderCurrentStep = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <IdentityVerification
//             formData={formData}
//             setFormData={setFormData}
//             onNext={handleNext}
//           />
//         );
//       case 2:
//         return (
//           <PersonalInformation
//             formData={formData}
//             setFormData={setFormData}
//             onNext={handleNext}
//             onPrevious={handlePrevious}
//           />
//         );
//       // case 3:
//       //   return (
//       //     <WorkplaceDetails
//       //       formData={formData}
//       //       setFormData={setFormData}
//       //       onNext={handleNext}
//       //       onPrevious={handlePrevious}
//       //     />
//       //   );
//       case 3:
//         return (
//           <AddressDetails
//             formData={formData}
//             setFormData={setFormData}
//             onNext={handleNext}
//             onPrevious={handlePrevious}
//           />
//         );
//       // case 4:
//       //   return (
//       //     <BankDetails
//       //       formData={formData}
//       //       setFormData={setFormData}
//       //       onNext={handleNext}
//       //       onPrevious={handlePrevious}
//       //     />
//       //   );
//       case 4:
//         return (
//           <OtherDetails
//             formData={formData}
//             setFormData={setFormData}
//             onNext={handleNext}
//             onPrevious={handlePrevious}
//           />
//         );
//       // case 5:
//       //   return (
//       //     <DocumentUpload
//       //       formData={formData}
//       //       setFormData={setFormData}
//       //       onNext={handleNext}
//       //       onPrevious={handlePrevious}
//       //     />
//       //   );
//       case 5:
//         return (
//           <ReviewSubmit
//             formData={formData}
//             onSubmit={handleSubmit}
//             onPrevious={handlePrevious}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
//           <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
//             <h1 className="text-2xl font-bold text-white">
//               {t("worker.registration")}
//             </h1>
//           </div>

//           <div className="p-6">
//             <Stepper steps={steps} currentStep={currentStep} />
//             {renderCurrentStep()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WorkerRegistration;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { useLanguage } from "../contexts/LanguageContext";
import Stepper from "../components/Stepper";
import IdentityVerification from "../components/worker-registration/IdentityVerification";
import PersonalInformation from "../components/worker-registration/PersonalInformation";
import WorkplaceDetails from "../components/worker-registration/WorkplaceDetails";
import AddressDetails from "../components/worker-registration/AddressDetails";
import BankDetails from "../components/worker-registration/BankDetails";
import OtherDetails from "../components/worker-registration/OtherDetails";
import DocumentUpload from "../components/worker-registration/DocumentUpload";
import ReviewSubmit from "../components/worker-registration/ReviewSubmit";
import { Loader2Icon } from "lucide-react";
import { formatWorkerPayload } from "../api/FormatEstablishmentPayload";
import { api } from "../api/api";

const WorkerRegistration: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Identity
    aadhaarNumber: "",
    otp: "",
    isOtpVerified: false,
    eSharmId: "",
    boCWId: "",

    // Personal Info
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    age: "",
    maritalStatus: "",
    fatherHusbandName: "",
    caste: "",
    subCaste: "",
    dependents: [],
    mobileNumber: "",
    password: "",

    // Workplace
    employerName: "",
    constructionOrg: "",
    tradeOfWork: "",
    workerCategory: "",

    // Address
    presentAddress: {
      doorNumber: "",
      street: "",
      district: "",
      mandal: "",
      village: "",
      pincode: "",
    },
    permanentAddress: {
      doorNumber: "",
      street: "",
      district: "",
      mandal: "",
      village: "",
      pincode: "",
    },
    sameAsPresent: false,

    // Bank Details
    accountNumber: "",
    confirmAccountNumber: "",
    bankName: "",
    ifscCode: "",
    branchName: "",
    branchAddress: "",

    // Other Details
    isNresWorker: "",
    isTradeUnionMember: "",
    tradeUnionNumber: "",

    // Documents
    documents: {
      passportPhoto: null,
      aadharCard: null,
      checkPassbook: null,
      nresDocument: null,
    },
  });

  const steps = [
    { id: 1, title: "Identity", completed: currentStep > 1 },
    { id: 2, title: "Personal", completed: currentStep > 2 },
    // { id: 3, title: "Workplace", completed: currentStep > 3 },
    { id: 3, title: "Address", completed: currentStep > 3 },
    // { id: 4, title: "Bank", completed: currentStep > 4 },
    { id: 4, title: "Other", completed: currentStep > 4 },
    // { id: 5, title: "Documents", completed: currentStep > 5 },
    { id: 5, title: "Review", completed: false },
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  interface WorkerRegisterResponse {
    correlationId: string;
    data: {
      message: string;
      workerId: number;
      worker: any;
    } | null;
    error?: {
      code: string;
      message: string;
      target?: string;
      details?: string[];
    };
  }


  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", formData);
      let payload = formatWorkerPayload(formData)
      console.log("Formatted Payload:", payload);

      const response = await api("/worker/register", "POST", payload) as WorkerRegisterResponse;
      if (response.data && response.data.workerId) {
        setIsSubmitting(false);
        toast.success("Worker registered successfully! Redirecting...", {
          duration: 3000,
          position: "top-center",
          icon: "✅",
          style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: '600',
          },
        });
        setTimeout(() => {
          navigate("/");
        }, 2500);
      } else {
        setIsSubmitting(false);
        toast.error(response.data?.message || "Registration failed. Please try again.", {
          duration: 4000,
          position: "top-center",
        });
      }
      console.log("API Response:", response);

    } catch (error) {
      setIsSubmitting(false);
      toast.error("Submission failed. Please try again.", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <IdentityVerification
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <PersonalInformation
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      // case 3:
      //   return (
      //     <WorkplaceDetails
      //       formData={formData}
      //       setFormData={setFormData}
      //       onNext={handleNext}
      //       onPrevious={handlePrevious}
      //     />
      //   );
      case 3:
        return (
          <AddressDetails
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      // case 4:
      //   return (
      //     <BankDetails
      //       formData={formData}
      //       setFormData={setFormData}
      //       onNext={handleNext}
      //       onPrevious={handlePrevious}
      //     />
      //   );
      case 4:
        return (
          <OtherDetails
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      // case 5:
      //   return (
      //     <DocumentUpload
      //       formData={formData}
      //       setFormData={setFormData}
      //       onNext={handleNext}
      //       onPrevious={handlePrevious}
      //     />
      //   );
      case 5:
        return (
          <ReviewSubmit
            formData={formData}
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen py-8">
<Toaster
 position="top-center"
 toastOptions={{
 style: {
 padding: '16px',
 fontSize: '16px',
 },
 success: {
 duration: 3000,
 iconTheme: {
 primary: '#10b981',
 secondary: '#fff',
 },
 },
 }}
 />      {/* Loading Overlay */}

      {isSubmitting && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2Icon
              height={40}
              width={40}
              className="animate-spin text-gray-500"
            />
            <p className="mt-4 text-gray-700 font-medium">Submitting...</p>
          </div>
        </div>
      )}

      <div className={isSubmitting ? "pointer-events-none opacity-50" : ""}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <h1 className="text-2xl font-bold text-white">
                {t("worker.registration")}
              </h1>
            </div>

            <div className="p-6">
              <Stepper steps={steps} currentStep={currentStep} />
              {renderCurrentStep()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerRegistration;
