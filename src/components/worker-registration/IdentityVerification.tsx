import React, { useState } from "react";
import { Shield } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import FormInput from "../FormInput";

interface IdentityVerificationProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({
  formData,
  setFormData,
  onNext,
}) => {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const formatAadhar = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const match = numbers.match(/(\d{0,4})(\d{0,4})(\d{0,4})/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join("-");
    }
    return value;
  };

  const handleAadharChange = (value: string) => {
    const formatted = formatAadhar(value);
    setFormData({
      ...formData,
      aadhaarNumber: formatted,
    });
  };

  const handleGenerateOtp = () => {
    if (
      !formData.aadhaarNumber ||
      formData.aadhaarNumber.replace(/-/g, "").length !== 12
    ) {
      setErrors({
        aadhaarNumber: "Please enter a valid 12-digit Aadhar number",
      });
      return;
    }
    setFormData({ ...formData, otp: '' });
    setErrors({});
    setOtpSent(true);
    // Simulate OTP generation
    console.log("OTP generated for:", formData.aadhaarNumber);
  };

  const handleVerifyOtp = () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    setIsVerifying(true);

    // Simulate OTP verification
    setTimeout(() => {
      setFormData({
        ...formData,
        isOtpVerified: true,
      });
      setIsVerifying(false);
    }, 1000);
  };

  const handleNext = () => {
    if (!formData.isOtpVerified) {
      setErrors({ general: "Please verify your OTP first" });
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          {t("worker.identifyYourself")}
        </h2>
        <p className="text-gray-600 mt-2">
          Please verify your identity using your Aadhar card
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-around items-start w-full">
              <FormInput
                label={t("worker.aadhaarNumber")}
                value={formData.aadhaarNumber}
                onChange={handleAadharChange}
                placeholder="XXXX-XXXX-XXXX"
                required
                maxLength={14}
                error={errors.aadhaarNumber}
                className="w-full md:w-[75%]"
              />
              <button
                type="button"
                onClick={handleGenerateOtp}
                disabled={
                  !formData.aadhaarNumber ||
                  formData.aadhaarNumber.replace(/-/g, "").length !== 12 ||
                  otpSent
                }
                className="w-full md:w-[25%] lg:[20%] mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-10"
              >
                {t("worker.generateOtp")}
              </button>
            </div>
          </div>

          {otpSent && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm mb-4">
                {t("worker.otpSent")}
              </p>

              <div className="flex gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between items-start w-full">
                  <FormInput
                    label={t("worker.enterOtp")}
                    value={formData.otp}
                    onChange={(value) =>
                      setFormData({ ...formData, otp: value })
                    }
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    pattern="[0-9]*"
                    error={errors.otp}
                    className="w-full md:w-auto"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={
                      !formData.otp || formData.otp.length !== 6 || isVerifying
                    }
                    className="w-full md:w-auto mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed h-10"
                  >
                    {isVerifying ? "Verifying..." : t("worker.verifyOtp")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {formData.isOtpVerified && (
            <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 mb-4">
                <Shield className="h-5 w-5" />
                <span className="font-medium">
                  Identity Verified Successfully!
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormInput
                  label={t("worker.eSharmId")}
                  value={formData.eSharmId}
                  onChange={(value) =>
                    setFormData({ ...formData, eSharmId: value })
                  }
                  placeholder="Enter eShram ID "
                />

                <FormInput
                  label={t("worker.boCWId")}
                  value={formData.boCWId}
                  onChange={(value) =>
                    setFormData({ ...formData, boCWId: value })
                  }
                  placeholder="Enter BoCW ID "
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{errors.general}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!formData.isOtpVerified}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {t("common.next")}
        </button>
      </div>
    </div>
  );
};

export default IdentityVerification;
