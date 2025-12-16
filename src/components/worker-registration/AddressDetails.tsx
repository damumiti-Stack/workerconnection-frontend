import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import { DISTRICTS } from "../../utils/constants";
import {
  fetchCitiesByDistrictId,
  fetchDistrictsByStateId,
  fetchVillagesByCityId,
} from "../../api/location";
import { useLoader } from "../../contexts/LoaderContext";

interface AddressDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}
// type OptionType = {
//   value: string;
//   label: string;
// };

const AddressDetails: React.FC<AddressDetailsProps> = ({
  formData,
  setFormData,
  onNext,
  onPrevious,
}) => {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [districts, setDistricts] = useState<{ value: string; label: string }[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(1);
  const { showLoader, hideLoader } = useLoader();


  type AddressKey = "presentAddress" | "permanentAddress";

  // Shared OptionType
  type OptionType = { value: string; label: string; code?: string; id?: string; name?: string };

  // Combine all mandal/village options into a single state object
  const [mandalOptions, setMandalOptions] = useState<Record<AddressKey, OptionType[]>>({
    presentAddress: [],
    permanentAddress: [],
  });
  const [villageOptions, setVillageOptions] = useState<Record<AddressKey, OptionType[]>>({
    presentAddress: [],
    permanentAddress: [],
  });

  // Use object-based refs for previous values
  const prevDistrict = useRef<Record<AddressKey, string>>({
    presentAddress: "",
    permanentAddress: "",
  });
  const prevMandal = useRef<Record<AddressKey, string>>({
    presentAddress: "",
    permanentAddress: "",
  });

  // const districtOptions = districts.map((d) => ({
  //   value: d.value,
  //   label: d.label,
  // }));
  const districtOptions = districts.map((d: any) => ({
  value: d.value,
  label: d.label,
  code: d.code,
  id: d.id,
  name: d.name,
}));


  console.log(districts, 'formData in districts')
  console.log(mandalOptions, 'formData in mandalptions')
  console.log(villageOptions, 'formData in villageOptions')


  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        showLoader("Loading districts...");
        const districtsData = await fetchDistrictsByStateId(1);
        const mapped = districtsData.map((d: any) => ({
          value: String(d.id || d.value),
          label: d.label || d.name,
          code: d.code ?? "",
          id: String(d.id || d.value),
          name: d.name || d.label,
        }));
        setDistricts(mapped);
      } catch (err) {
        console.error("Failed to fetch districts:", err);
        setDistricts([]);
      } finally {
        hideLoader();
      }
    };
    fetchDistricts();
  }, []);



  useEffect(() => {
    const fetchMandals = async (type: AddressKey, districtId: string) => {
      if (!districtId) return;
      try {
        const options = await fetchCitiesByDistrictId(districtId);
        const mapped = options.map((o: any) => ({
          value: String(o.id),
          label: o.name,
          code: o.code ?? "",
          id: String(o.id),
          name: o.name,
        }));
        setMandalOptions((prev) => ({ ...prev, [type]: mapped }));

        setFormData((prev: any) => {

          const current = prev[type]?.mandal;
          if (current && mapped.some((m) => m.value === current.value)) {
            return prev;
          }
          if (prev.sameAsPresent && type === "permanentAddress") return prev;
          return {
            ...prev,
            [type]: { ...prev[type], mandal: null, village: null },
          };
        });
      } catch (error) {
        console.error(`Error fetching mandals for ${type}:`, error);
      }
    };

    (["presentAddress", "permanentAddress"] as AddressKey[]).forEach((type) => {
      const districtId = formData[type]?.district?.value;
      if (districtId && districtId !== prevDistrict.current[type]) {
        fetchMandals(type, districtId);
        prevDistrict.current[type] = districtId;
      }
    });
  }, [formData.presentAddress?.district, formData.permanentAddress?.district]);


  useEffect(() => {
    const fetchVillages = async (type: AddressKey, mandalId: string) => {
      if (!mandalId) return;
      try {
        const options = await fetchVillagesByCityId(mandalId);
        const mapped = options.map((v: any) => ({
          value: String(v.id),
          label: v.name,
          code: v.code ?? "",
          id: String(v.id),
          name: v.name,
        }));
        setVillageOptions((prev) => ({ ...prev, [type]: mapped }));

        setFormData((prev: any) => {
          const current = prev[type]?.village;
          if (current && mapped.some((m) => m.value === current.value)) {
            return prev; 
          }
          if (prev.sameAsPresent && type === "permanentAddress") return prev;
          return { ...prev, [type]: { ...prev[type], village: null } };
        });
      } catch (error) {
        console.error(`Error fetching villages for ${type}:`, error);
      }
    };

    (["presentAddress", "permanentAddress"] as AddressKey[]).forEach((type) => {
      const mandalId = formData[type]?.mandal?.value;
      if (mandalId && mandalId !== prevMandal.current[type]) {
        fetchVillages(type, mandalId);
        prevMandal.current[type] = mandalId;
      }
    });
  }, [formData.presentAddress?.mandal, formData.permanentAddress?.mandal]);




  const handleSameAsPresent = (checked: boolean) => {
    if (checked) {
      setFormData((prev: any) => ({
        ...prev,
        sameAsPresent: true,
        permanentAddress: { ...prev.presentAddress }, // copy everything
      }));

      // also copy mandal & village options for permanent so dropdowns are filled
      setMandalOptions((prev) => ({
        ...prev,
        permanentAddress: mandalOptions.presentAddress,
      }));
      setVillageOptions((prev) => ({
        ...prev,
        permanentAddress: villageOptions.presentAddress,
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        sameAsPresent: false,
        permanentAddress: {
          doorNumber: "",
          street: "",
          district: "",
          mandal: "",
          village: "",
          pincode: "",
        },
      }));

      setMandalOptions((prev) => ({ ...prev, permanentAddress: [] }));
      setVillageOptions((prev) => ({ ...prev, permanentAddress: [] }));
    }
  };


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const { presentAddress, permanentAddress, sameAsPresent } = formData;

    // Present Address validation
    if (!presentAddress?.doorNumber?.trim()) {
      newErrors.presentDoorNumber = "Door number is required";
    }
    if (!presentAddress?.street?.trim()) {
      newErrors.presentStreet = "Street is required";
    }
    if (!presentAddress?.district) {
      newErrors.presentDistrict = "District is required";
    }
    if (!presentAddress?.mandal) {
      newErrors.presentMandal = "Mandal is required";
    }
    if (!presentAddress?.village) {
      newErrors.presentVillage = "Village is required";
    }
    if (!presentAddress?.pincode?.trim()) {
      newErrors.presentPincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(presentAddress.pincode.trim())) {
      newErrors.presentPincode = "Please enter a valid 6-digit pincode";
    }

    // Permanent Address validation (if not same as present)
    if (!sameAsPresent) {
      if (!permanentAddress?.doorNumber?.trim()) {
        newErrors.permanentDoorNumber = "Door number is required";
      }
      if (!permanentAddress?.street?.trim()) {
        newErrors.permanentStreet = "Street is required";
      }
      if (!permanentAddress?.mandal) {
        newErrors.permanentMandal = "Mandal is required";
      }
      if (!permanentAddress?.village) {
        newErrors.permanentVillage = "Village is required";
      }
      if (!permanentAddress?.pincode?.trim()) {
        newErrors.permanentPincode = "Pincode is required";
      } else if (!/^\d{6}$/.test(permanentAddress.pincode.trim())) {
        newErrors.permanentPincode = "Please enter a valid 6-digit pincode";
      }
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
        <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          {t("worker.addressDetails")}
        </h2>
        <p className="text-gray-600 mt-2">
          Please provide your present and permanent address details
        </p>
      </div>

      {/* Present Address */}
      <div className="bg-blue-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("worker.presentAddress")}
        </h3>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormInput
              label={t("worker.doorNumber")}
              value={formData.presentAddress?.doorNumber || ""}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  presentAddress: {
                    ...formData.presentAddress,
                    doorNumber: value,
                  },
                })
              }
              required
              error={errors.presentDoorNumber}
            />

            <FormInput
              label={t("worker.street")}
              value={formData.presentAddress?.street || ""}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  presentAddress: { ...formData.presentAddress, street: value },
                })
              }
              required
              error={errors.presentStreet}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">

            <FormSelect
              label={t("worker.district")}
              value={formData.presentAddress?.district?.value || ""}   // ✅ just the value
              onChange={(value) => {
                const selected = districts.find((d) => d.value === value);
                setFormData((prev: any) => ({
                  ...prev,
                  presentAddress: {
                    ...prev.presentAddress,
                    district: selected || null, // ✅ store full object
                  },
                }));
              }}
              options={districtOptions}
              required
              error={errors.presentDistrict}
            />

            <FormSelect
              label={t("worker.mandal")}
              value={formData.presentAddress?.mandal?.value || ""}   // just the value
              onChange={(value) => {
                const selected = mandalOptions["presentAddress"].find((m) => m.value === value);
                setFormData((prev: any) => ({
                  ...prev,
                  presentAddress: {
                    ...prev.presentAddress,
                    mandal: selected || null,   // store full object
                  },
                }));
              }}
              options={mandalOptions["presentAddress"]}
              required
              error={errors.presentMandal}
            />

            <FormSelect
              label={t("worker.village")}
              value={formData.presentAddress?.village?.value || ""}   // just the value for rendering
              onChange={(value) => {
                const selected = villageOptions["presentAddress"].find((v) => v.value === value);
                setFormData((prev: any) => ({
                  ...prev,
                  presentAddress: {
                    ...prev.presentAddress,
                    village: selected || null,  // store full object
                  },
                }));
              }}
              options={villageOptions["presentAddress"]}
              required
              error={errors.presentVillage}
            />


          </div>

          <FormInput
            label={t("worker.pincode")}
            value={formData.presentAddress?.pincode || ""}
            onChange={(value) =>
              setFormData({
                ...formData,
                presentAddress: { ...formData.presentAddress, pincode: value },
              })
            }
            maxLength={6}
            pattern="[0-9]*"
            required
            error={errors.presentPincode}
          />
        </div>
      </div>

      {/* Same as Present Address Checkbox */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="sameAsPresent"
          checked={formData.sameAsPresent || false}
          onChange={(e) => handleSameAsPresent(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="sameAsPresent"
          className="text-sm font-medium text-gray-700"
        >
          {t("worker.sameAsPresent")}
        </label>
      </div>

      {/* Permanent Address */}
      <div className="bg-green-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("worker.permanentAddress")}
        </h3>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormInput
              label={t("worker.doorNumber")}
              value={formData.permanentAddress?.doorNumber || ""}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  permanentAddress: {
                    ...formData.permanentAddress,
                    doorNumber: value,
                  },
                })
              }
              required={!formData.sameAsPresent}
              disabled={formData.sameAsPresent}
              error={errors.permanentDoorNumber}
            />

            <FormInput
              label={t("worker.street")}
              value={formData.permanentAddress?.street || ""}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  permanentAddress: {
                    ...formData.permanentAddress,
                    street: value,
                  },
                })
              }
              required={!formData.sameAsPresent}
              disabled={formData.sameAsPresent}
              error={errors.permanentStreet}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <FormSelect
              label={t("worker.district")}
              value={formData.permanentAddress?.district?.value || ""}
              onChange={(value) => {
                const selected = districtOptions.find((d) => d.value === value);
                setFormData((prev: any) => ({
                  ...prev,
                  permanentAddress: {
                    ...prev.permanentAddress,
                    district: selected || null,
                  },
                }));
              }}
              options={districtOptions}
              required={!formData.sameAsPresent}
              disabled={formData.sameAsPresent}
              error={errors.permanentDistrict}
            />


            <FormSelect
              label={t("worker.mandal")}
              value={formData.permanentAddress?.mandal?.value || ""}
              onChange={(value) => {
                const selected = mandalOptions["permanentAddress"].find((m) => m.value === value);
                setFormData((prev: any) => ({
                  ...prev,
                  permanentAddress: {
                    ...prev.permanentAddress,
                    mandal: selected || null,
                  },
                }));
              }}
              options={mandalOptions["permanentAddress"]}
              required={!formData.sameAsPresent}
              disabled={formData.sameAsPresent}
              error={errors.permanentMandal}
            />

            <FormSelect
              label={t("worker.village")}
              value={formData.permanentAddress?.village?.value || ""}
              onChange={(value) => {
                const selected = villageOptions["permanentAddress"].find((v) => v.value === value);
                setFormData((prev: any) => ({
                  ...prev,
                  permanentAddress: {
                    ...prev.permanentAddress,
                    village: selected || null,
                  },
                }));
              }}
              options={villageOptions["permanentAddress"]}
              required={!formData.sameAsPresent}
              disabled={formData.sameAsPresent}
              error={errors.permanentVillage}
            />


          </div>

          <FormInput
            label={t("worker.pincode")}
            value={formData.permanentAddress?.pincode || ""}
            onChange={(value) =>
              setFormData({
                ...formData,
                permanentAddress: {
                  ...formData.permanentAddress,
                  pincode: value,
                },
              })
            }
            maxLength={6}
            pattern="[0-9]*"
            required={!formData.sameAsPresent}
            disabled={formData.sameAsPresent}
            error={errors.permanentPincode}
          />
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

export default AddressDetails;
