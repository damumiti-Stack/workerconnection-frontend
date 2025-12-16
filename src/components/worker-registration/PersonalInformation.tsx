import React, { useState, useEffect } from "react";
import { User, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import { GENDERS, MARITAL_STATUS, RELATIONSHIPS, validateName } from "../../utils/constants";

interface PersonalInformationProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({
  formData,
  setFormData,
  onNext,
  onPrevious,
}) => {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate age based on date of birth
  useEffect(() => {
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      setFormData({
        ...formData,
        age: age.toString(),
      });
    }
  }, [formData.dateOfBirth]);

  // Get min and max dates for DOB (18-60 years from current date)
  const getDateLimits = () => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    const minDate = new Date(
      today.getFullYear() - 60,
      today.getMonth(),
      today.getDate()
    );

    return {
      min: minDate.toISOString().split("T")[0],
      max: maxDate.toISOString().split("T")[0],
    };
  };

  const { min: minDate, max: maxDate } = getDateLimits();

  // const handleAddDependent = () => {
  //   const newDependent = {
  //     id: Date.now(),
  //     name: "",
  //     dateOfBirth: "",
  //     relationship: "",
  //     isNominee: "",
  //     benefitPercentage: "",
  //   };

  //   setFormData({
  //     ...formData,
  //     dependents: [...(formData.dependents || []), newDependent],
  //   });
  // };

  // const handleRemoveDependent = (id: number) => {
  //   setFormData({
  //     ...formData,
  //     dependents: formData.dependents.filter((dep: any) => dep.id !== id),
  //   });
  // };

  const handleDependentChange = (id: number, field: string, value: string) => {
    setFormData({
      ...formData,
      dependents: formData.dependents.map((dep: any) =>
        dep.id === id ? { ...dep, [field]: value } : dep
      ),
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const firstNameError = validateName(formData.firstName, "First name");
    const lastNameError = validateName(formData.lastName, "Last name");

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (firstNameError !== true) {
      // setErrors({ firstName: firstNameError });
      newErrors.firstName = firstNameError as string;
      // return;
    }
    if (lastNameError !== true) {
      newErrors.lastName = lastNameError as string;
      // return;
    }
    if (!formData.password?.trim()) {
      newErrors.password = "Password is required";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          {t("worker.personalInfo")}
        </h2>
        <p className="text-gray-600 mt-2">
          Please provide your personal information
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl space-y-6">
        {/* Basic Information */}
        <div className="grid md:grid-cols-3 gap-4">
          <FormInput
            label={t("worker.firstName")}
            value={formData.firstName || ""}
            onChange={(value) => setFormData({ ...formData, firstName: value })}
            required
            error={errors.firstName}
          />

          <FormInput
            label={t("worker.middleName")}
            value={formData.middleName || ""}
            onChange={(value) =>
              setFormData({ ...formData, middleName: value })
            }
          />

          <FormInput
            label={t("worker.lastName")}
            value={formData.lastName || ""}
            onChange={(value) => setFormData({ ...formData, lastName: value })}
            required
            error={errors.lastName}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormSelect
            label={t("worker.gender")}
            value={formData.gender || ""}
            onChange={(value) => setFormData({ ...formData, gender: value })}
            options={GENDERS}
            required
            error={errors.gender}
          />

          <FormSelect
            label={t("worker.maritalStatus")}
            value={formData.maritalStatus || ""}
            onChange={(value) =>
              setFormData({ ...formData, maritalStatus: value })
            }
            options={MARITAL_STATUS.map((status) => ({
              value: status.toLowerCase(),
              label: status,
            }))}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("worker.dateOfBirth")} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dateOfBirth || ""}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              min={minDate}
              max={maxDate}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.dateOfBirth ? "border-red-500" : ""
                }`}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
            )}
          </div>

          <FormInput
            label={t("worker.age")}
            value={formData.age || ""}
            onChange={() => { }} // Read-only
            disabled
          />

          <FormInput
            label={t("worker.fatherHusbandName")}
            value={formData.fatherHusbandName || ""}
            onChange={(value) =>
              setFormData({ ...formData, fatherHusbandName: value })
            }
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormInput
            label={t("worker.caste")}
            value={formData.caste || ""}
            onChange={(value) =>
              setFormData({ ...formData, caste: value.toUpperCase() })
            }
          />

          <FormInput
            label={t("worker.subCaste")}
            value={formData.subCaste || ""}
            onChange={(value) =>
              setFormData({ ...formData, subCaste: value.toUpperCase() })
            }
          />
          <FormInput
            label={t("worker.mobileNumber")}
            type="tel"
            value={formData.mobileNumber}
            onChange={(value) =>
              setFormData({ ...formData, mobileNumber: value })
            }
            required
            maxLength={10}
            error={errors.mobileNumber}
            autoComplete="new-tel"
          />

          <FormInput
            label={t("worker.password")}
            type="password"
            value={formData.password}
            onChange={(value) =>
              setFormData({ ...formData, password: value })
            }
            required
            error={errors.password}
            autoComplete="new-password"
          />

        </div>
      </div>

      {/* Dependents Section */}
      {/* <div className="bg-blue-50 p-6 rounded-xl">
        <div className="flex flex-col md:flex-row md:mx-1 items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("worker.dependents")}
          </h3>
          <button
            type="button"
            onClick={handleAddDependent}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            {t("worker.addDependent")}
          </button>
        </div>

        {formData.dependents?.map((dependent: any, index: number) => (
          <div
            key={dependent.id}
            className="bg-white p-4 rounded-lg mb-4 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">
                Dependent {index + 1}
              </h4>
              <button
                type="button"
                onClick={() => handleRemoveDependent(dependent.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <FormInput
                label={t("worker.dependentName")}
                value={dependent.name}
                onChange={(value) =>
                  handleDependentChange(dependent.id, "name", value)
                }
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("worker.dependentDob")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dependent.dateOfBirth}
                  onChange={(e) =>
                    handleDependentChange(
                      dependent.id,
                      "dateOfBirth",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <FormSelect
                label={t("worker.relationship")}
                value={dependent.relationship}
                onChange={(value) =>
                  handleDependentChange(dependent.id, "relationship", value)
                }
                options={RELATIONSHIPS.map((rel) => ({
                  value: rel.toLowerCase(),
                  label: rel,
                }))}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormSelect
                label={t("worker.nominee")}
                value={dependent.isNominee}
                onChange={(value) =>
                  handleDependentChange(dependent.id, "isNominee", value)
                }
                options={[
                  { value: "yes", label: t("common.yes") },
                  { value: "no", label: t("common.no") },
                ]}
              />

              {dependent.isNominee === "yes" && (
                <FormInput
                  label={t("worker.benefitPercentage")}
                  type="number"
                  value={dependent.benefitPercentage}
                  onChange={(value) =>
                    handleDependentChange(
                      dependent.id,
                      "benefitPercentage",
                      Math.max(0, Math.min(100, Number(value))).toString()
                    )
                  }
                  placeholder="0-100"
                  maxLength={3}
                />
              )}
            </div>
          </div>
        ))}

        {(!formData.dependents || formData.dependents.length === 0) && (
          <p className="text-gray-500 text-center py-4">
            No dependents added yet. Click "Add Dependent" to add family
            members.
          </p>
        )}
      </div> */}

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

export default PersonalInformation;
