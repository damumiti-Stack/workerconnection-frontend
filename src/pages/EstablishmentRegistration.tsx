import React, { useEffect, useRef, useState } from "react";
import { Building2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import {
  DISTRICTS,
  // ESTABLISHMENT_CATEGORIES,
  // NATURE_OF_WORK,
  getDistrictLabel,
  getEstablishmentCategoryLabel,
  getNatureOfWorkLabel,
} from "../utils/constants";
import {
  fetchCitiesByDistrictId,
  fetchDistrictsByStateId,
  fetchVillagesByCityId,
} from "../api/location";
import { api, fetchEstablishmentCategories, fetchNatureOfWorkByCategory } from "../api/api";
import toast, { Toaster } from "react-hot-toast";
import { Loader2Icon } from "lucide-react";

const EstablishmentRegistration: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    // Establishment Details
    establishmentName: "",
    ownerName: "",
    emailAddress: "",
    mobileNumber: "",

    // Address Details
    doorNumber: "",
    street: "",
    district: "",
    mandal: "",
    village: "",
    pincode: "",

    // Business Details
    hasPlanApproval: "",
    planApprovalId: "",
    establishmentCategory: "",
    natureOfWork: "",
    commencementDate: "",
    completionDate: "",
    contractorsWorking: "",
    contractors: [],

    // Construction Details
    estimatedCost: "",
    constructionArea: "",
    builtUpArea: "",
    basicEstimationCost: "",
    maleWorkers: "",
    femaleWorkers: "",

    // Declaration
    declaration: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [establishmentCategoryOptions, setEstablishmentCategoryOptions] = useState<CategoryOptionType[]>([]);
  const [natureOfWorkOptions, setNatureOfWorkOptions] = useState<OptionType[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: 1, title: "Establishment Details" },
    { id: 2, title: "Address Details" },
    { id: 3, title: "Business Details" },
    { id: 4, title: "Construction Details" },
    { id: 5, title: "Review & Submit" },
  ];

  const districtOptions = DISTRICTS.map((district) => ({
    value: district.name.toLowerCase().replace(/\s+/g, "_"),
    label: district.name,
  }));

  // const natureOfWorkOptions = NATURE_OF_WORK.map((nature) => ({
  //   value: nature.toLowerCase().replace(/\s+/g, "_"),
  //   label: nature,
  // }));
  type OptionType = {
    value: string;
    label: string;
    code: string;
    id: string;
    name: string;
  };

  type CategoryOptionType = {
    value: string;
    label: string;
  }
  const [mandalOptions, setMandalOptions] = useState<OptionType[]>([]);
  const [villageOptions, setVillageOptions] = useState<OptionType[]>([]);
  const [districts, setDistricts] = useState<{ value: string, label: string, code: string, id: string, name: string }[]>([]);
  const [cities, setCities] = useState<{ value: string, label: string, code: string, id: string, name: string }[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<{ id: string, code: string } | null>(null);
  const [selectedCity, setSelectedCity] = useState<{ id: string, code: string } | null>(null);

  useEffect(() => {
    if (progressRef.current) {
      const container = progressRef.current;
      const activeStep = container.querySelector(`[data-step="${currentSection}"]`);

      if (activeStep) {
        const containerWidth = container.offsetWidth;
        const stepPosition = (activeStep as HTMLElement).offsetLeft;
        const stepWidth = (activeStep as HTMLElement).offsetWidth;

        container.scrollTo({
          left: stepPosition - (containerWidth / 2) + (stepWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  }, [currentSection]);

  const validateCurrentSection = () => {
    const newErrors: Record<string, string> = {};

    switch (currentSection) {
      case 1:
        if (!formData.establishmentName.trim())
          newErrors.establishmentName = "Establishment name is required";
        if (!formData.ownerName.trim())
          newErrors.ownerName = "Owner/Manager name is required";
        if (!formData.emailAddress.trim())
          newErrors.emailAddress = "Email address is required";
        if (!formData.mobileNumber.trim())
          newErrors.mobileNumber = "Mobile number is required";
        break;
      case 2:
        if (!formData.doorNumber.trim())
          newErrors.doorNumber = "Door number is required";
        if (!formData.street.trim()) newErrors.street = "Street is required";
        if (!formData.district) newErrors.district = "District is required";
        if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
        break;
      case 3:
        if (!formData.establishmentCategory)
          newErrors.establishmentCategory = "Category is required";
        if (!formData.natureOfWork)
          newErrors.natureOfWork = "Nature of work is required";
        if (!formData.commencementDate)
          newErrors.commencementDate = "Commencement date is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentSection() && currentSection < 5) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const submitEstablishment = async () => {
    // const selectedDistrict = districts.find(
    //   (d) => d.name.toLowerCase().replace(/\s+/g, "_") === formData.district
    // );
    const selectedDistrict = districts.find(d => d.value === formData.district);
    const selectedCity = mandalOptions.find(c => c.value === formData.mandal);
    const selectedVillage = villageOptions.find(v => v.value === formData.village);
    const selectedCategory = establishmentCategoryOptions.find(c => c.value === formData.establishmentCategory);
    const selectedNatureOfWork = natureOfWorkOptions.find(n => n.value === formData.natureOfWork);

    console.log(selectedDistrict, "selectedDistrict");
    const payload = {
      establishmentId: 0,
      establishmentName: formData.establishmentName,
      contactPerson: formData.ownerName,
      mobileNumber: Number(formData.mobileNumber),
      emailId: formData.emailAddress,
      password: "Password@123", // or however you're handling password
      doorNumber: formData.doorNumber,
      street: formData.street,
      stateId: 1,
      stateCode: "AP",

      districtId: Number(selectedDistrict?.id) || 0,
      districtCode: selectedDistrict?.code || "",
      districtName: selectedDistrict?.name || "",

      // cityId: Number(formData.mandal),

      cityId: Number(selectedCity?.id) || 0,
      cityCode: selectedCity?.code || "",
      cityName: selectedCity?.name || "",

      // villageOrAreaId: Number(formData.village),

      villageOrAreaId: Number(selectedVillage?.id) || 0,
      villageOrAreaCode: selectedVillage?.code || "",
      villageOrAreaName: selectedVillage?.name || "",

      pincode: Number(formData.pincode),
      isPlanApprovalId: formData.hasPlanApproval === "yes" ? "Y" : "N",
      planApprovalId: formData.planApprovalId || "",
      categoryId: Number(selectedCategory?.value) || 0, // static or mapped
      workNatureId: Number(selectedNatureOfWork?.value) || 0, // static or mapped
      commencementDate: formData.commencementDate,
      completionDate: formData.completionDate || formData.commencementDate,
      constructionEstimatedCost: Number(formData.estimatedCost || 0),
      constructionArea: Number(formData.constructionArea || 0),
      builtUpArea: Number(formData.builtUpArea || 0),
      basicEstimatedCost: Number(formData.basicEstimationCost || 0),
      noOfMaleWorkers: Number(formData.maleWorkers || 0),
      noOfFemaleWorkers: Number(formData.femaleWorkers || 0),
      isAcceptedTermsAndConditions: formData.declaration ? "Y" : "N",
    };

    try {
      setIsSubmitting(true);
      const data = await api("/establishment/register", "POST", payload);
      console.log("Submitted successfully:", data);
      setIsSubmitting(false);
      toast.success("Establishment registered successfully!", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
      console.log(payload, "payload");
    } catch (error) {
      console.error("Submission failed:", error);
      setIsSubmitting(false);
      toast.error("Something went wrong!", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.declaration) {
      setErrors({ declaration: "Please accept the declaration" });
      return;
    }
    submitEstablishment();
  };

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        const districtsval = await fetchDistrictsByStateId(1);
        // Ensure each district has a 'code' property
        const districtsWithCode = districtsval.map((d: any) => ({
          value: d.value,
          label: d.label,
          code: d.code ?? "",
          id: d.id,
          name: d.name,
        }));
        console.log(districtsWithCode, "districtsWithCode");
        setDistricts(districtsWithCode);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
        toast.error("Failed to load districts");
        setDistricts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (!formData.district) return;

    const selectedDistrict = districts.find(
      (d) => d.value.toLowerCase().replace(/\s+/g, "_") === formData.district
    );

    const districtId = selectedDistrict?.id;
    if (!districtId) return;

    const fetchMandals = async () => {
      try {
        const options = await fetchCitiesByDistrictId(districtId);
        console.log(options, "options");
        const mappedOptions = options.map((o: any) => ({
          value: o.value,
          label: o.label,
          code: o.code ?? "",
          id: o.id ?? "",
          name: o.name ?? o.label ?? "",
        }));
        setMandalOptions(mappedOptions);

        setFormData((prev) => ({
          ...prev,
          mandal: "",
          village: "",
        }));
      } catch (error) {
        console.error("Failed to fetch mandals:", error);
      }
    };

    fetchMandals();
  }, [formData.district]);

  useEffect(() => {
    if (!formData.mandal) return;

    const loadVillages = async () => {
      try {
        const options = await fetchVillagesByCityId(formData.mandal);
        const mappedOptions = options.map((v: any) => ({
          value: v.value,
          label: v.label,
          code: v.code ?? "",
          id: v.id ?? "",
          name: v.name ?? v.label ?? "",
        }));
        setVillageOptions(mappedOptions);
        setFormData((prev) => ({ ...prev, village: "" }));
      } catch (err) {
        console.error("Failed to fetch villages:", err);
      }
    };

    loadVillages();
  }, [formData.mandal]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const options = await fetchEstablishmentCategories();
        setEstablishmentCategoryOptions(options);
      } catch (err) {
        console.error("Error loading establishment categories:", err);
      }
    };

    loadCategories();
  }, [])

  useEffect(() => {
    if (!formData.establishmentCategory) return;

    const categoryId = Number(formData.establishmentCategory);
    if (!categoryId) return;

    const loadNatureOfWork = async () => {
      try {
        const options = await fetchNatureOfWorkByCategory(categoryId);
        setNatureOfWorkOptions(options);
        setFormData((prev) => ({ ...prev, natureOfWork: "" }));
      } catch (err) {
        console.error("Failed to fetch nature of work:", err);
      }
    };

    loadNatureOfWork();
  }, [formData.establishmentCategory]);


  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("establishment.establishmentDetails")}
            </h3>

            <FormInput
              label={t("establishment.establishmentName")}
              value={formData.establishmentName}
              onChange={(value) =>
                setFormData({ ...formData, establishmentName: value })
              }
              required
              error={errors.establishmentName}
            />

            <FormInput
              label={t("establishment.ownerName")}
              value={formData.ownerName}
              onChange={(value) =>
                setFormData({ ...formData, ownerName: value })
              }
              required
              error={errors.ownerName}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label={t("establishment.emailAddress")}
                type="email"
                value={formData.emailAddress}
                onChange={(value) =>
                  setFormData({ ...formData, emailAddress: value })
                }
                required
                error={errors.emailAddress}
              />

              <FormInput
                label={t("establishment.mobileNumber")}
                type="tel"
                value={formData.mobileNumber}
                onChange={(value) =>
                  setFormData({ ...formData, mobileNumber: value })
                }
                required
                maxLength={10}
                error={errors.mobileNumber}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("worker.addressDetails")}
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label={t("worker.doorNumber")}
                value={formData.doorNumber}
                onChange={(value) =>
                  setFormData({ ...formData, doorNumber: value })
                }
                required
                error={errors.doorNumber}
              />

              <FormInput
                label={t("worker.street")}
                value={formData.street}
                onChange={(value) =>
                  setFormData({ ...formData, street: value })
                }
                required
                error={errors.street}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <FormSelect
                label={t("worker.district")}
                value={formData.district}
                onChange={(value) =>
                  setFormData({ ...formData, district: value })
                }
                options={districts}
                required
                error={errors.district}
              />
              <FormSelect
                label={t("worker.mandal")}
                value={formData.mandal}
                onChange={(value) =>
                  setFormData({ ...formData, mandal: value })
                }
                options={mandalOptions}
                required
                error={errors.district}
              />
              <FormSelect
                label={t("worker.village")}
                value={formData.village}
                onChange={(value) =>
                  setFormData({ ...formData, village: value })
                }
                options={villageOptions}
                required
                error={errors.district}
              />
            </div>

            <FormInput
              label={t("worker.pincode")}
              value={formData.pincode}
              onChange={(value) => setFormData({ ...formData, pincode: value })}
              maxLength={6}
              pattern="[0-9]*"
              required
              error={errors.pincode}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("establishment.businessDetails")}
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <FormSelect
                label={t("establishment.planApprovalId")}
                value={formData.hasPlanApproval}
                onChange={(value) =>
                  setFormData({ ...formData, hasPlanApproval: value })
                }
                options={[
                  { value: "yes", label: t("common.yes") },
                  { value: "no", label: t("common.no") },
                ]}
              />

              {formData.hasPlanApproval === "yes" && (
                <FormInput
                  label={t("establishment.planApprovalIdValue")}
                  value={formData.planApprovalId}
                  onChange={(value) =>
                    setFormData({ ...formData, planApprovalId: value })
                  }
                />
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormSelect
                label={t("establishment.establishmentCategory")}
                value={formData.establishmentCategory}
                onChange={(value) =>
                  setFormData({ ...formData, establishmentCategory: value })
                }
                options={establishmentCategoryOptions}
                required
                error={errors.establishmentCategory}
              />

              <FormSelect
                label={t("establishment.natureOfWork")}
                value={formData.natureOfWork}
                onChange={(value) =>
                  setFormData({ ...formData, natureOfWork: value })
                }
                options={natureOfWorkOptions}
                required
                error={errors.natureOfWork}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("establishment.commencementDate")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.commencementDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commencementDate: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.commencementDate ? "border-red-500" : ""
                    }`}
                />
                {errors.commencementDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.commencementDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("establishment.completionDate")}
                </label>
                <input
                  type="date"
                  value={formData.completionDate}
                  onChange={(e) =>
                    setFormData({ ...formData, completionDate: e.target.value })
                  }
                  min={
                    formData.commencementDate ||
                    new Date().toISOString().split("T")[0]
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Construction Details
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label={t("establishment.estimatedCost")}
                value={formData.estimatedCost}
                onChange={(value) =>
                  setFormData({ ...formData, estimatedCost: value })
                }
                placeholder="e.g., 10,00,00,000"
              />

              <FormInput
                label={t("establishment.constructionArea")}
                value={formData.constructionArea}
                onChange={(value) =>
                  setFormData({ ...formData, constructionArea: value })
                }
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label={t("establishment.builtUpArea")}
                value={formData.builtUpArea}
                onChange={(value) =>
                  setFormData({ ...formData, builtUpArea: value })
                }
                placeholder="Area in sq ft"
              />

              <FormInput
                label={t("establishment.basicEstimationCost")}
                value={formData.basicEstimationCost}
                onChange={(value) =>
                  setFormData({ ...formData, basicEstimationCost: value })
                }
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label={t("establishment.maleWorkers")}
                type="number"
                value={formData.maleWorkers}
                onChange={(value) =>
                  setFormData({ ...formData, maleWorkers: value })
                }
                placeholder="Number of male workers"
              />

              <FormInput
                label={t("establishment.femaleWorkers")}
                type="number"
                value={formData.femaleWorkers}
                onChange={(value) =>
                  setFormData({ ...formData, femaleWorkers: value })
                }
                placeholder="Number of female workers"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Review & Submit
            </h3>

            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">
                  Establishment Details
                </h4>
                <p className="text-gray-600">
                  Name: {formData.establishmentName}
                </p>
                <p className="text-gray-600">Owner: {formData.ownerName}</p>
                <p className="text-gray-600">Email: {formData.emailAddress}</p>
                <p className="text-gray-600">Mobile: {formData.mobileNumber}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Address</h4>
                <p className="text-gray-600">
                  {formData.doorNumber}, {formData.street},{" "}
                  {getDistrictLabel(formData.district)}, {formData.pincode}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Business Details</h4>
                <p className="text-gray-600">
                  Category:{" "}
                  {getEstablishmentCategoryLabel(
                    formData.establishmentCategory
                  )}
                </p>
                <p className="text-gray-600">
                  Nature of Work: {getNatureOfWorkLabel(formData.natureOfWork)}
                </p>
                <p className="text-gray-600">
                  Commencement: {formData.commencementDate}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={formData.declaration}
                  onChange={(e) =>
                    setFormData({ ...formData, declaration: e.target.checked })
                  }
                  className="mt-1"
                />
                <label htmlFor="declaration" className="text-sm text-blue-900">
                  {t("establishment.declarationText")}
                </label>
              </div>
              {errors.declaration && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.declaration}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen py-8">
      <Toaster position="top-center" />
      {/* Loading Overlay */}
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
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">
                {t("establishment.registration")}
              </h1>
            </div>
          </div>

          {/* Progress Indicator */}
          <div ref={progressRef} className="bg-gray-50 px-6 py-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="flex items-center justify-center min-w-max space-x-4 md:space-x-8">
              {sections.map((section, index) => (
                <div key={section.id} data-step={section.id} className={`flex flex-col items-center ${currentSection >= section.id ? 'text-orange-600' : 'text-gray-500'}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${currentSection >= section.id
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {section.id}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium whitespace-nowrap ${currentSection >= section.id ? "text-orange-600" : "text-gray-500"
                      }`}
                  >
                    {section.title}
                  </span>
                  {index < sections.length && (
                    <div
                      className={`hidden md:block w-12 h-0.5 mx-4 ${currentSection >= section.id
                        ? "bg-orange-600"
                        : "bg-gray-300"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            {renderSection()}

            <div className="flex justify-between mt-8">
              {currentSection > 1 && (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  {t("common.previous")}
                </button>
              )}

              {currentSection < 5 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium ml-auto"
                >
                  {t("common.next")}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium ml-auto"
                >
                  {t("common.submit")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default EstablishmentRegistration;
