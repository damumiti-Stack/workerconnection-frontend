import React, { useState } from "react";
import { Info } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import FormSelect from "../FormSelect";
import FormInput from "../FormInput";

interface OtherDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const OtherDetails: React.FC<OtherDetailsProps> = ({
  formData,
  setFormData,
  onNext,
  onPrevious,
}) => {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.isNresWorker) {
      newErrors.isNresWorker = "Please select if you are an NRES worker";
    }

    if (!formData.isTradeUnionMember) {
      newErrors.isTradeUnionMember =
        "Please select if you are a trade union member";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const yesNoOptions = [
    { value: "yes", label: t("common.yes") },
    { value: "no", label: t("common.no") },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Info className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          {t("worker.otherDetails")}
        </h2>
        <p className="text-gray-600 mt-2">
          Please provide additional information about your employment status
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl space-y-6">
        <FormSelect
          label={t("worker.nresWorker")}
          value={formData.isNresWorker || ""}
          onChange={(value) =>
            setFormData({ ...formData, isNresWorker: value })
          }
          options={yesNoOptions}
          placeholder="Select an option"
          required
          error={errors.isNresWorker}
        />

        <FormSelect
          label={t("worker.tradeUnionMember")}
          value={formData.isTradeUnionMember || ""}
          onChange={(value) =>
            setFormData({ ...formData, isTradeUnionMember: value })
          }
          options={yesNoOptions}
          placeholder="Select an option"
          required
          error={errors.isTradeUnionMember}
        />
        {formData.isTradeUnionMember === "yes" && (
          <FormInput
            label={t("worker.tradeUnionNumber")}
            value={formData.tradeUnionNumber}
            onChange={(value: string) =>
              setFormData({ ...formData, tradeUnionNumber: value })
            }
            required
          />
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Information</h3>
        <div className="text-blue-800 text-sm space-y-2">
          <p>
            <strong>NRES Worker:</strong> Non-Resident External Skilled worker
            who works outside their home state.
          </p>
          <p>
            <strong>Trade Union Member:</strong> A worker who is a member of a
            registered trade union organization.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          {t("common.previous")}
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          {t("common.next")}
        </button>
      </div>
    </div>
  );
};

export default OtherDetails;
