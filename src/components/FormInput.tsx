import React from "react";
// import { useLanguage } from "../contexts/LanguageContext";

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  maxLength?: number;
  pattern?: string;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  maxLength,
  pattern,
  disabled = false,
  className = "",
  autoComplete
}) => {
  // const { t } = useLanguage();

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {/* {!required && (
            <span className="text-gray-400 ml-1 text-xs">
              ({t('forms.placeholders.optional')})
            </span>
          )} */}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        pattern={pattern}
        disabled={disabled}
        className={`input-mobile w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          error ? "border-red-500" : ""
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
        autoComplete={autoComplete}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;
