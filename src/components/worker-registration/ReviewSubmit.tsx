import React, { useState } from "react";
import { CheckCircle, Eye, Send } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  getDistrictLabel,
  getTradeLabel,
  getWorkerCategoryLabel,
  getGenderLabel,
  getMaritalStatusLabel,
  getYesNoLabel,
} from "../../utils/constants";

interface ReviewSubmitProps {
  formData: any;
  onSubmit: () => void;
  onPrevious: () => void;
}

const ReviewSubmit: React.FC<ReviewSubmitProps> = ({
  formData,
  onSubmit,
  onPrevious,
}) => {
  const { t } = useLanguage();
  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => {
    setShowPreview(true);
    // In a real application, this would generate and show a PDF preview
    alert("PDF preview would be generated and displayed here");
    setShowPreview(false);
  };

  const renderSection = (title: string, data: Record<string, any>) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      <div className="grid md:grid-cols-2 gap-3 ">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between flex-col">
            <span className="text-gray-600 text-sm">{key}:</span>
            <span className="text-gray-900 text-sm font-medium">
              {value || "Not provided"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
        <p className="text-gray-600 mt-2">
          Please review your information before submitting
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl max-h-96 overflow-y-auto">
        {/* Identity Information */}
        {renderSection("Identity Information", {
          "Aadhar Number": formData.aadhaarNumber,
          "eShram ID": formData.eSharmId,
          "BoCW ID": formData.boCWId,
        })}

        {/* Personal Information */}
        {renderSection("Personal Information", {
          "Full Name": `${formData.firstName} ${formData.middleName || ""} ${formData.lastName
            }`.trim(),
          Gender: getGenderLabel(formData.gender),
          "Date of Birth": formData.dateOfBirth,
          Age: formData.age,
          "Marital Status": getMaritalStatusLabel(formData.maritalStatus),
          "Father/Husband Name": formData.fatherHusbandName,
          Caste: formData.caste,
          "Sub Caste": formData.subCaste,
        })}

        {/* Workplace Details
        {renderSection('Workplace Details', {
          'Employer Name': formData.employerName,
          'Construction Organisation': formData.constructionOrg,
          'Trade of Work': getTradeLabel(formData.tradeOfWork),
          'Worker Category': getWorkerCategoryLabel(formData.workerCategory)
        })} */}

        {/* Address Details */}
        {renderSection("Present Address", {
          "Door Number": formData.presentAddress?.doorNumber,
          Street: formData.presentAddress?.street,
          District: getDistrictLabel(formData.presentAddress?.district?.label || ""),
          Mandal: formData.presentAddress?.mandal?.label || "",
          Village: formData.presentAddress?.village?.label || "",
          Pincode: formData.presentAddress?.pincode
        })}

        {/* Bank Details
        {renderSection('Bank Details', {
          'Account Number': formData.accountNumber,
          'Bank Name': formData.bankName,
          'IFSC Code': formData.ifscCode,
          'Branch Name': formData.branchName
        })} */}

        {/* Other Details */}
        {renderSection("Other Details", {
          "NRES Worker": getYesNoLabel(formData.isNresWorker),
          "Trade Union Member": getYesNoLabel(formData.isTradeUnionMember),
          "Trade Union Number": formData.tradeUnionNumber,
        })}

        {/* Documents
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-900 mb-3">
            Documents Uploaded
          </h4>
          <div className="space-y-2">
            {Object.entries(formData.documents || {})
              .filter(
                ([, doc]: [string, any]) => doc !== null && doc !== undefined
              )
              .map(([key, doc]: [string, any]) => (
                <div
                  key={key}
                  className="flex items-center justify-between bg-green-50 p-2 rounded"
                >
                  <span className="text-sm text-green-800">{doc.name}</span>
                  <span className="text-xs text-green-600">{doc.size}MB</span>
                </div>
              ))}
          </div>
        </div> */}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          {t("common.previous")}
        </button>

        <div className="flex space-x-4">
          {/* <button
            onClick={handlePreview}
            disabled={showPreview}
            className="flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium disabled:opacity-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Generating..." : t("common.preview")}
          </button> */}

          <button
            onClick={onSubmit}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            <Send className="h-4 w-4 mr-2" />
            {t("common.submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmit;
