import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import { fetchAvailableAadhaarCardDetails, persistWorkerDetails } from "../api/api";
import { Button } from "@mui/material";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

interface WorkerOption {
  id: number;
  name: string;
  aadhaar: string;
}

interface AddWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (worker: WorkerOption) => void;
}

const AddWorkerModal: React.FC<AddWorkerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedWorker, setSelectedWorker] = useState<WorkerOption | null>(
    null
  );
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<WorkerOption[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState<string | null>(null);
  const { user } = useAuth();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;
    onSubmit(selectedWorker);
    setSelectedWorker(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);

    fetchAvailableAadhaarCardDetails()
      .then((data) => {
        setOptions(
          data.map((item: {
            id: number;
            label: string;
            aadhaarNumber: string;
            workerName: string;
          }) => ({
            id: item.id,
            name: item.workerName,
            aadhaar: item.aadhaarNumber,
          }))
        );
      })
      .catch((error) => {
        console.error("Failed to fetch Aadhaar card details:", error);
        setOptions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen]);

  if (!isOpen) return null;
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fromDate) {
      newErrors.fromDate = t("forms.validation.required");
    }
    if (!formData.toDate) {
      newErrors.toDate = t("forms.validation.required");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    if (!selectedWorker) return;

    setLoading(true);
    const establishmentId = user?.type === "establishment" ? user?.establishmentId : null;
    try {
      const payload = {
        estmtWorkerId: null,
        establishmentId: Number(establishmentId), // Ensure establishmentId is a number
        workerId: selectedWorker.id,
        aadhaarCardNumber: selectedWorker.aadhaar,
        workingFromDate: formData.fromDate,
        workingToDate: formData.toDate,
        status: "W",           // or get from a form input or constant
      };

      await persistWorkerDetails(payload);


      // reset form
      setSelectedWorker(null);
      setFormData({ fromDate: "", toDate: "" });
      onClose();

      if (onSubmit) onSubmit(selectedWorker); // notify parent if needed
    } catch (error: any) {
      console.error("API error:", error);
      setApiError(error.message || t("worker.addWorkerError") || "Failed to save worker details.");
    } finally {
      setLoading(false);
    }
  };

  const formatAadhaar = (aadhaar: string) => {
  if (!aadhaar) return '';
  const digits = aadhaar.replace(/\D/g, '');
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`;
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <h2 className="text-lg font-bold mb-4">Add Worker</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Stack spacing={3} sx={{ width: 500 }}>
            <Autocomplete
              options={options}
              getOptionLabel={(option) =>
                `${option.name} (${formatAadhaar(option.aadhaar)})`
              }
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              value={selectedWorker}
              onChange={(_, newValue) => setSelectedWorker(newValue)}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Aadhaar / Worker Name"
                  placeholder="Type to search..."
                />
              )}
            />
          </Stack>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("worker.fromDate")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.fromDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fromDate: e.target.value,
                })
              }
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fromDate ? "border-red-500" : ""
                }`}
            />
            {errors.fromDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fromDate}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("establishment.toDate")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.toDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  toDate: e.target.value,
                })
              }
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.toDate ? "border-red-500" : ""
                }`}
            />
            {errors.toDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.toDate}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!selectedWorker}
              onClick={handleFormSubmit}
            >
              Add
            </Button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading Aadhaar details...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddWorkerModal;
